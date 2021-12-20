package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"
  "embed"
	"path"
	"strings"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	_ "modernc.org/sqlite"
	// _ "github.com/mattn/go-sqlite3"
)
const INDEX = "index.html"

// 默认是 0
type Setting struct {
	Id int `json:"id"`
	Favicon string `json:"favicon"`
	Title string `json:"title"`
}

type User struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Password string `json:"password"`
}

type resUserDto struct {
	Name string `json:"name"`
}

type updateUserDto struct {
	Id       int64 `json:"id"`
	Name     string `json:"name"`
	Password string `json:"password"`
}

type Tool struct {
	Id      int    `json:"id"`
	Name    string `json:"name"`
	Url     string `json:"url"`
	Logo    string `json:"logo"`
	Catelog string `json:"catelog"`
	Desc    string `json:"desc"`
}

type addToolDto struct {
	Name    string `json:"name"`
	Url     string `json:"url"`
	Logo    string `json:"logo"`
	Catelog string `json:"catelog"`
	Desc    string `json:"desc"`
}

type updateToolDto struct {
	Id      int `json:"id"`
	Name    string `json:"name"`
	Url     string `json:"url"`
	Logo    string `json:"logo"`
	Catelog string `json:"catelog"`
	Desc    string `json:"desc"`
}
type updateCatelogDto struct {
	Id   int `json:"id"`
	Name string  `json:"name"`
}

type addCatelogDto struct {
	Name string `json:"name"`
}

type Catelog struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

func checkErr(err error) {
	if err != nil {
		fmt.Println("捕获到错误：",err)
	}
}

type loginDto struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

func updateCatelog(data updateCatelogDto, db *sql.DB) {
	sql_update_catelog := `
		UPDATE nav_catelog
		SET name = ?
		WHERE id = ?;
		`
	stmt, err := db.Prepare(sql_update_catelog)
	checkErr(err)
	res, err := stmt.Exec(data.Name, data.Id)
	checkErr(err)
	_, err = res.RowsAffected()
	checkErr(err)
	// fmt.Println(affect)
}

func updateTool(data updateToolDto, db *sql.DB) {
	sql_update_tool := `
		UPDATE nav_table
		SET name = ?, url = ?, logo = ?, catelog = ?, desc = ?
		WHERE id = ?;
		`
	stmt, err := db.Prepare(sql_update_tool)
	checkErr(err)
	res, err := stmt.Exec(data.Name, data.Url, data.Logo, data.Catelog, data.Desc, data.Id)
	checkErr(err)
	_, err = res.RowsAffected()
	checkErr(err)
	// fmt.Println(affect)
}

func updateSetting(data Setting, db *sql.DB) {
	sql_update_setting := `
		UPDATE nav_setting
		SET favicon = ?, title = ?
		WHERE id = ?;
		`
	stmt, err := db.Prepare(sql_update_setting)
	checkErr(err)
	res, err := stmt.Exec(data.Favicon, data.Title, 0)
	checkErr(err)
	_, err = res.RowsAffected()
	checkErr(err)
	// fmt.Println(affect)
}


func updateUser(data updateUserDto, db *sql.DB) {
	sql_update_user := `
		UPDATE nav_user
		SET name = ?, password = ?
		WHERE id = ?;
		`
	stmt, err := db.Prepare(sql_update_user)
	checkErr(err)
	res, err := stmt.Exec(data.Name, data.Password, data.Id)
	checkErr(err)
	_, err = res.RowsAffected()
	checkErr(err)
	// fmt.Println(affect)
}

func addCatelog(data addCatelogDto, db *sql.DB) {
	sql_add_catelog := `
		INSERT INTO nav_catelog (id,name)
		VALUES (?,?);
		`
  // fmt.Println("增加分类：",data)
	stmt, err := db.Prepare(sql_add_catelog)
	checkErr(err)
	res, err := stmt.Exec(generateId(), data.Name)
	checkErr(err)
	_, err = res.LastInsertId()
	checkErr(err)
	// fmt.Println(id)
}

func addTool(data addToolDto, db *sql.DB) {
	sql_add_tool := `
		INSERT INTO nav_table (id,name, url, logo, catelog, desc)
		VALUES (?, ?, ?, ?, ?, ?);
		`
	stmt, err := db.Prepare(sql_add_tool)
	checkErr(err)
	res, err := stmt.Exec(generateId(), data.Name, data.Url, data.Logo, data.Catelog, data.Desc)
	checkErr(err)
	_, err = res.LastInsertId()
	checkErr(err)
	// fmt.Println(id)
}

func getAllTool(db *sql.DB) []Tool {
	sql_get_all := `
		SELECT * FROM nav_table;
		`
	results := make([]Tool, 0)
	rows, err := db.Query(sql_get_all)
	checkErr(err)
	for rows.Next() {
		var tool Tool
		err = rows.Scan(&tool.Id, &tool.Name, &tool.Url, &tool.Logo, &tool.Catelog, &tool.Desc)
		checkErr(err)
		results = append(results, tool)
	}
  defer rows.Close()
	return results
}

func getAllCatelog(db *sql.DB) []Catelog {
	sql_get_all := `
		SELECT * FROM nav_catelog;
		`
	results := make([]Catelog, 0)
	rows, err := db.Query(sql_get_all)
	checkErr(err)
	for rows.Next() {
		var catelog Catelog
		err = rows.Scan(&catelog.Id, &catelog.Name)
		checkErr(err)
		results = append(results, catelog)
	}
  defer rows.Close()
	return results
}

func generateId() int {
	// 生成一个随机 id
	return int(time.Now().Unix())
}

var db *sql.DB

func initDB() {
	// 创建数据库
	db, _ = sql.Open("sqlite", "./nav.db")
	// user 表
	sql_create_table := `
		CREATE TABLE IF NOT EXISTS nav_user (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			password TEXT
		);
		`
	_, err := db.Exec(sql_create_table)
	checkErr(err)
		// setting 表
	sql_create_table = `
	CREATE TABLE IF NOT EXISTS nav_setting (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		favicon TEXT,
		title TEXT
	);
	`
	_, err = db.Exec(sql_create_table)
	checkErr(err)
	// 默认 tools 用的 表 
	sql_create_table = `
		CREATE TABLE IF NOT EXISTS nav_table (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			url TEXT,
			logo TEXT,
			catelog TEXT,
			desc TEXT
		);
		`
	_, err = db.Exec(sql_create_table)
	checkErr(err)
	// 分类表
	sql_create_table = `
		CREATE TABLE IF NOT EXISTS nav_catelog (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT
		);
		`
	_, err = db.Exec(sql_create_table)
	checkErr(err)
	// 如果不存在，就初始化用户
	sql_get_user := `
		SELECT * FROM nav_user;
		`
	rows, err := db.Query(sql_get_user)
	checkErr(err)
	if !rows.Next() {
		sql_add_user := `
			INSERT INTO nav_user (id, name, password)
			VALUES (?, ?, ?);
			`
		stmt, err := db.Prepare(sql_add_user)
		checkErr(err)
		res, err := stmt.Exec(generateId(), "admin", "admin")
		checkErr(err)
		_, err = res.LastInsertId()
		checkErr(err)
		// fmt.Println(id)
	}
	rows.Close()
	// 如果不存在设置，就初始化
	sql_get_setting := `
		SELECT * FROM nav_setting;
		`
	rows, err = db.Query(sql_get_setting)
	checkErr(err)
	if !rows.Next() {
		sql_add_setting := `
			INSERT INTO nav_setting (id, favicon, title)
			VALUES (?, ?, ?);
			`
		stmt, err := db.Prepare(sql_add_setting)
		checkErr(err)
		res, err := stmt.Exec(0, "https://pic.mereith.com/img/male.svg", "Van Nav")
		checkErr(err)
		_, err = res.LastInsertId()
		checkErr(err)
		// fmt.Println(id)
	}
  rows.Close()
	fmt.Println("数据库初始化成功。。。")
}
//go:embed public
var fs embed.FS

type binaryFileSystem struct {
	fs http.FileSystem
	root string
}
func (b *binaryFileSystem) Open(name string) (http.File, error) {
	// fmt.Println("打开文件",name)
	openPath := path.Join(b.root,name)
	return b.fs.Open(openPath)
}

func (b *binaryFileSystem) Exists(prefix string, filepath string) bool {
	if p := strings.TrimPrefix(filepath, prefix); len(p) < len(filepath) {
		var name string
		if p == "" {
			// fmt.Println("找 index")
			name = path.Join(b.root, p,INDEX)
		} else {
			name = path.Join(b.root,p)
		}
		// 判断
		// fmt.Println("文件是否存在？",name)
		if _, err := b.fs.Open(name); err != nil {
			return false
		}
		return true
	}
	return false
}
func BinaryFileSystem(data embed.FS,root string) *binaryFileSystem {
	fs := http.FS(data)
	return &binaryFileSystem{
		fs,
		root,
	}
}
func main() {
	initDB()
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()
	// 嵌入文件夹

  // public,_ := fs.ReadDir("./public")
	// router.StaticFS("/",http.FS(fs))
	
	

	router.Use(static.Serve("/", BinaryFileSystem(fs,"public")))
	// router.Use(static.Serve("/", static.LocalFile("./public", true)))
	api := router.Group("/api")
	{
		// 获取数据的路由
		api.GET("/", GetAllHandler)
		// 获取用户信息
		
		api.POST("/login", LoginHandler)
		api.GET("/logout", LogoutHandler)

		// 管理员用的
		admin := api.Group("/admin")
		admin.Use(JWTMiddleware())
		{
			admin.GET("/all",GetAdminAllDataHandler)

			admin.PUT("/user", UpdateUserHandler)

			admin.PUT("/setting", UpdateSettingHandler)

			admin.POST("/tool", AddToolHandler)
			admin.DELETE("/tool/:id", DeleteToolHandler)
			admin.PUT("/tool/:id", UpdateToolHandler)

			admin.POST("/catelog", AddCatelogHandler)
			admin.DELETE("/catelog/:id", DeleteCatelogHandler)
			admin.PUT("/catelog/:id", UpdateCatelogHandler)
		}
	}
	fmt.Println("应用启动成功，网址:   http://localhost:8233")
	router.Run(":8233")
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
			"setting": setting,
		},
	})
}

func GetAdminAllDataHandler(c *gin.Context) {
	// 管理员获取全部数据，还有个用户名。
	tools := getAllTool(db)
	catelogs := getAllCatelog(db)
	setting := getSetting(db)
	userId,ok := c.Get("uid")
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"success":      false,
			"errorMessage": "不存在该用户！",
		})
		return
	}
	c.JSON(200,gin.H{
		"success": true,
		"data": gin.H{
			"tools":    tools,
			"catelogs": catelogs,
			"setting": setting,
			"user": gin.H{
				"name": c.GetString("username"),
				"id": userId,
			},
		},
	})
}



func getSetting(db *sql.DB) Setting {
	sql_get_user := `
		SELECT * FROM nav_setting WHERE id = ?;
		`
	var setting Setting
	row := db.QueryRow(sql_get_user, 0)
	err := row.Scan(&setting.Id,&setting.Favicon,&setting.Title)
	checkErr(err)
	return setting
}

func getUser(name string, db *sql.DB) User {
	sql_get_user := `
		SELECT * FROM nav_user WHERE name = ?;
		`
	var user User
	row := db.QueryRow(sql_get_user, name)
	err := row.Scan(&user.Id, &user.Name, &user.Password)
	checkErr(err)
	return user
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
			"success": false,
			"errorMessage": "用户名不存在",
		})
		return
	}
	if user.Password != data.Password {
		c.JSON(200, gin.H{
			"success": false,
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
			"user": user,
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

// JTW 密钥
var jwtSecret = []byte("boy_next_door")

// 签名一个 JTW
func SignJWT(user User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"name": user.Name,
		"id": user.Id,
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
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
				"success": false,
				"errorMessage": "未登录",
			})
			c.Abort()
			return
		}
		// 解析 token
		token, err := ParseJWT(rawToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
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
				"success": false,
				"errorMessage": "未登录",
			})
			c.Abort()
			return
		}
	}
}
