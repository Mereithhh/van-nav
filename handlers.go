package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func ExportToolsHandler(c *gin.Context) {
	tools := getAllTool(db)
	c.JSON(200, gin.H{
		"success": true,
		"message": "导出工具成功",
		"data":    tools,
	})
}

func ImportToolsHandler(c *gin.Context) {
	var tools []Tool
	err := c.ShouldBindJSON(&tools)
	if err != nil {
		checkErr(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success":      false,
			"errorMessage": err.Error(),
		})
		return
	}
	// 导入所有工具
	importTools(tools)
	c.JSON(200, gin.H{
		"success": true,
		"message": "导入工具成功",
	})
}

func DeleteApiTokenHandler(c *gin.Context) {
	// 删除 Token
	id := c.Param("id")
	sql_delete_api_token := `
		UPDATE nav_api_token
		SET disabled = 1
		WHERE id = ?;
		`
	stmt, err := db.Prepare(sql_delete_api_token)
	checkErr(err)
	res, err := stmt.Exec(id)
	checkErr(err)
	_, err = res.RowsAffected()
	checkErr(err)
	// fmt.Println(affect)
	c.JSON(200, gin.H{
		"success": true,
		"message": "删除 API Token 成功",
	})
}

func AddApiTokenHandler(c *gin.Context) {
	var token AddTokenDto
	err := c.ShouldBindJSON(&token)
	if err != nil {
		checkErr(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success":      false,
			"errorMessage": err.Error(),
		})
		return
	}
	newId := generateId()
	var signedJwt string
	signedJwt, err = SignJWTForAPI(token.Name, newId)
	if err != nil {
		checkErr(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success":      false,
			"errorMessage": err.Error(),
		})
		return
	}
	addApiTokenInDB(Token{
		Name:     token.Name,
		Value:    signedJwt,
		Id:       newId,
		Disabled: 0,
	}, db)
	// 签名 jwt
	c.JSON(200, gin.H{
		"success": true,
		"data": gin.H{
			"id":    newId,
			"Value": signedJwt,
			"Name":  token.Name,
		},
		"message": "添加 Token 成功",
	})
}

func UpdateSettingHandler(c *gin.Context) {
	var data Setting
	if err := c.ShouldBindJSON(&data); err != nil {
		checkErr(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success":      false,
			"errorMessage": err.Error(),
		})
		return
	}
	updateSetting(data, db)
	c.JSON(200, gin.H{
		"success": true,
		"message": "更新配置成功",
	})
}

func UpdateUserHandler(c *gin.Context) {
	var data updateUserDto
	if err := c.ShouldBindJSON(&data); err != nil {
		checkErr(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success":      false,
			"errorMessage": err.Error(),
		})
		return
	}
	updateUser(data, db)
	c.JSON(200, gin.H{
		"success": true,
		"message": "更新用户成功",
	})
}

func GetAllHandler(c *gin.Context) {
	// 获取全部数据
	tools := getAllTool(db)
	catelogs := getAllCatelog(db)
	setting := getSetting(db)
	c.JSON(200, gin.H{
		"success": true,
		"data": gin.H{
			"tools":    tools,
			"catelogs": catelogs,
			"setting":  setting,
		},
	})
}

func GetAdminAllDataHandler(c *gin.Context) {
	// 管理员获取全部数据，还有个用户名。
	tools := getAllTool(db)
	catelogs := getAllCatelog(db)
	setting := getSetting(db)
	tokens := getApiTokens(db)
	userId, ok := c.Get("uid")
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"success":      false,
			"errorMessage": "不存在该用户！",
		})
		return
	}
	c.JSON(200, gin.H{
		"success": true,
		"data": gin.H{
			"tools":    tools,
			"catelogs": catelogs,
			"setting":  setting,
			"user": gin.H{
				"name": c.GetString("username"),
				"id":   userId,
			},
			"tokens": tokens,
		},
	})
}

func LoginHandler(c *gin.Context) {
	var data loginDto
	if err := c.ShouldBindJSON(&data); err != nil {
		checkErr(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success":      false,
			"errorMessage": err.Error(),
		})
		return
	}
	user := getUser(data.Name, db)
	if user.Name == "" {
		c.JSON(200, gin.H{
			"success":      false,
			"errorMessage": "用户名不存在",
		})
		return
	}
	if user.Password != data.Password {
		c.JSON(200, gin.H{
			"success":      false,
			"errorMessage": "密码错误",
		})
		return
	}
	// 生成 token
	token, err := SignJWT(user)
	checkErr(err)

	c.JSON(200, gin.H{
		"success": true,
		"message": "登录成功",
		"data": gin.H{
			"user":  user,
			"token": token,
		},
	})

}

// 退出登录
func LogoutHandler(c *gin.Context) {
	// fmt.Println("TODO： 销毁 JWT")
	c.JSON(200, gin.H{
		"success": true,
		"message": "登出成功",
	})
}

func AddToolHandler(c *gin.Context) {
	// 添加工具
	var data addToolDto
	if err := c.ShouldBindJSON(&data); err != nil {
		checkErr(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success":      false,
			"errorMessage": err.Error(),
		})
		return
	}
	fmt.Println(data.Name, " 获取 logo: ", data.Logo)
	if data.Logo == "" {
		data.Logo = getIcon(data.Url)
	}
	addTool(data, db)
	c.JSON(200, gin.H{
		"success": true,
		"message": "添加成功",
	})
}

func DeleteToolHandler(c *gin.Context) {
	// 删除工具
	id := c.Param("id")
	sql_delete_tool := `
		DELETE FROM nav_table WHERE id = ?;
		`
	stmt, err := db.Prepare(sql_delete_tool)
	checkErr(err)
	res, err := stmt.Exec(id)
	checkErr(err)
	_, err = res.RowsAffected()
	checkErr(err)
	// fmt.Println(affect)
	c.JSON(200, gin.H{
		"success": true,
		"message": "删除成功",
	})
}

func UpdateToolHandler(c *gin.Context) {
	// 更新工具
	var data updateToolDto
	if err := c.ShouldBindJSON(&data); err != nil {
		checkErr(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success":      false,
			"errorMessage": err.Error(),
		})
		return
	}
	fmt.Println(data.Name, " 获取 logo: ", data.Logo)
	if data.Logo == "" {
		data.Logo = getIcon(data.Url)
	}
	updateTool(data, db)
	c.JSON(200, gin.H{
		"success": true,
		"message": "更新成功",
	})
}

func AddCatelogHandler(c *gin.Context) {
	// 添加分类
	var data addCatelogDto
	if err := c.ShouldBindJSON(&data); err != nil {
		checkErr(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success":      false,
			"errorMessage": err.Error(),
		})
		return
	}
	addCatelog(data, db)

	c.JSON(200, gin.H{
		"success": true,
		"message": "增加分类成功",
	})
}

func DeleteCatelogHandler(c *gin.Context) {
	// 删除分类
	id := c.Param("id")
	sql_delete_catelog := `
		DELETE FROM nav_catelog WHERE id = ?;
		`
	stmt, err := db.Prepare(sql_delete_catelog)
	checkErr(err)
	res, err := stmt.Exec(id)
	checkErr(err)
	_, err = res.RowsAffected()
	checkErr(err)
	// fmt.Println(affect)
	c.JSON(200, gin.H{
		"success": true,
		"message": "删除分类成功",
	})
}

func UpdateCatelogHandler(c *gin.Context) {
	// 更新分类
	var data updateCatelogDto
	if err := c.ShouldBindJSON(&data); err != nil {
		checkErr(err)
		c.JSON(http.StatusBadRequest, gin.H{
			"success":      false,
			"errorMessage": err.Error(),
		})
		return
	}
	updateCatelog(data, db)

	c.JSON(200, gin.H{
		"success": true,
		"message": "更新分类成功",
	})
}
