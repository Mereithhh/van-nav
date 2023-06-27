package main

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
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
			pathHasAdmin := strings.Contains(path, "/admin")
			pathHasAPI := strings.Contains(path, "/api")
			if !pathHasAdmin || pathHasAPI {
				return
			} else {
				adminFile, err := fs.Open("/admin/index.html")
				if err != nil {
					fmt.Println("文件不存在", c.Request.URL.Path)
					return
				}
				defer adminFile.Close()
				// 把文件返回
				http.ServeContent(c.Writer, c.Request, "index.html", time.Now(), adminFile)
				c.Abort()
			}

		}
	}
}
