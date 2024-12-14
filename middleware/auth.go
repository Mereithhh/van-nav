package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"github.com/mereith/nav/database"
	"github.com/mereith/nav/utils"
)

// 定义一个 JWT 的中间件, 除了校验 jtw，还要校验之前签发的 api token 只要一样就放行。
func JWTMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		rawToken := c.Request.Header.Get("Authorization")
		if rawToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success":      false,
				"errorMessage": "未登录",
			})
			c.Abort()
			return
		}

		if database.HasApiToken(rawToken) {
			c.Set("username", "apiToken")
			c.Set("uid", 1)
			c.Next()
			return
		}

		// 解析 token
		token, err := utils.ParseJWT(rawToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success":      false,
				"errorMessage": "未登录",
			})
			c.Abort()
			return
		}
		// 把名称加到上下文
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			c.Set("username", claims["name"])
			c.Set("uid", claims["id"])
			c.Next()
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success":      false,
				"errorMessage": "未登录",
			})
			c.Abort()
			return
		}
	}
}
