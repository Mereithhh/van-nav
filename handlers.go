package main

import (
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
