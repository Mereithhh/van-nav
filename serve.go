package main

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/mereith/nav/logger"
)

type ServeFileSystem interface {
	http.FileSystem
	Exists(prefix string, path string) bool
}

func Serve(urlPrefix string, fs ServeFileSystem) gin.HandlerFunc {
	fileserver := http.FileServer(fs)
	if urlPrefix != "" {
		fileserver = http.StripPrefix(urlPrefix, fileserver)
	}
	return func(c *gin.Context) {
		if fs.Exists(urlPrefix, c.Request.URL.Path) {
			fileserver.ServeHTTP(c.Writer, c.Request)
			c.Abort()
		} else {
			path := c.Request.URL.Path
			pathHasAPI := strings.Contains(path, "/api") && !strings.Contains(path, "/api-token")
			// pathHasAdmin := strings.Contains(path, "/admin")
			// pathHasLogin := strings.Contains(path, "/login")
			if pathHasAPI {
				return
			} else {
				file, err := fs.Open("index.html")
				if err != nil {
					logger.LogError("文件不存在: %s", c.Request.URL.Path)
					return
				}
				defer file.Close()
				// 把文件返回
				http.ServeContent(c.Writer, c.Request, "index.html", time.Now(), file)
				c.Abort()
			}

		}
	}
}
