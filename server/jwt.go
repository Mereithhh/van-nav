package main

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

// JTW 密钥
var jwtSecret = []byte("boy_next_door")

// 签名一个 JTW
func SignJWT(user User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"name": user.Name,
		"id":   user.Id,
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})
	tokenString, err := token.SignedString([]byte(jwtSecret))
	return tokenString, err
}

// 签名一个 JTW
func SignJWTForAPI(tokenName string, tokenId int) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"name": tokenName,
		"id":   tokenId,
		"exp":  time.Now().Add(time.Hour * 24 * 365 * 100).Unix(),
	})
	tokenString, err := token.SignedString([]byte(jwtSecret))
	return tokenString, err
}

// 解密一个 JTW
func ParseJWT(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (i interface{}, e error) {
		return jwtSecret, nil
	})
	return token, err
}

// 定义一个 JWT 的中间件
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
		// 解析 token
		token, err := ParseJWT(rawToken)
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

func JWTCheck(c *ginContext) bool  {
  rawToken := c.Request.Header.Get("Authorization")
  if rawToken == "" {
    return false
  }
  return true
}
