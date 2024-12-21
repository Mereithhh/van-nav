package main

import (
	"embed"
	"flag"
	"fmt"
	"net/http"
	"path"
	"strings"

	"github.com/mereith/nav/database"
	"github.com/mereith/nav/handler"
	"github.com/mereith/nav/logger"
	"github.com/mereith/nav/middleware"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
)

const INDEX = "index.html"

//go:embed public
var fs embed.FS

type binaryFileSystem struct {
	fs   http.FileSystem
	root string
}

func (b *binaryFileSystem) Open(name string) (http.File, error) {
	openPath := path.Join(b.root, name)
	return b.fs.Open(openPath)
}

func (b *binaryFileSystem) Exists(prefix string, filepath string) bool {
	if p := strings.TrimPrefix(filepath, prefix); len(p) < len(filepath) {
		var name string
		if p == "" {
			name = path.Join(b.root, p, INDEX)
		} else {
			name = path.Join(b.root, p)
		}
		// 判断
		if _, err := b.fs.Open(name); err != nil {
			return false
		}
		return true
	}
	return false
}
func BinaryFileSystem(data embed.FS, root string) *binaryFileSystem {
	fs := http.FS(data)
	return &binaryFileSystem{
		fs,
		root,
	}
}

var port = flag.String("port", "6412", "指定监听端口")

func main() {
	flag.Parse()
	database.InitDB()
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()
	router.Use(gzip.Gzip(gzip.DefaultCompression))
	// 嵌入文件夹
	router.GET("/manifest.json", handler.ManifastHanlder)
	router.Use(Serve("/", BinaryFileSystem(fs, "public")))
	api := router.Group("/api")
	{
		// 获取数据的路由
		api.GET("/", handler.GetAllHandler)
		// 获取用户信息

		api.POST("/login", handler.LoginHandler)
		api.GET("/logout", handler.LogoutHandler)
		api.GET("/img", handler.GetLogoImgHandler)
		// 管理员用的
		admin := api.Group("/admin")
		admin.Use(middleware.JWTMiddleware())
		{
			admin.POST("/apiToken", handler.AddApiTokenHandler)
			admin.DELETE("/apiToken/:id", handler.DeleteApiTokenHandler)
			admin.GET("/all", handler.GetAdminAllDataHandler)

			admin.GET("/exportTools", handler.ExportToolsHandler)

			admin.POST("/importTools", handler.ImportToolsHandler)

			admin.PUT("/user", handler.UpdateUserHandler)

			admin.PUT("/setting", handler.UpdateSettingHandler)

			admin.POST("/tool", handler.AddToolHandler)
			admin.DELETE("/tool/:id", handler.DeleteToolHandler)
			admin.PUT("/tool/:id", handler.UpdateToolHandler)
			admin.PUT("/tools/sort", handler.UpdateToolsSortHandler)

			admin.POST("/catelog", handler.AddCatelogHandler)
			admin.DELETE("/catelog/:id", handler.DeleteCatelogHandler)
			admin.PUT("/catelog/:id", handler.UpdateCatelogHandler)
		}
	}
	logger.LogInfo("应用启动成功，网址: http://localhost:%s", *port)
	listen := fmt.Sprintf(":%s", *port)
	err := router.Run(listen)
	if err != nil {
		logger.LogError("应用启动失败，错误: %s", err)
	}
}
