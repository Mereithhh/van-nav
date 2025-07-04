package database

import (
	"database/sql"
	"path/filepath"

	_ "modernc.org/sqlite"

	"github.com/mereith/nav/logger"
	"github.com/mereith/nav/utils"
)

var DB *sql.DB

func columnExists(tableName string, columnName string) bool {
	query := `SELECT COUNT(*) FROM pragma_table_info(?) WHERE name=?`
	var count int
	err := DB.QueryRow(query, tableName, columnName).Scan(&count)
	if err != nil {
		return false
	}
	return count > 0
}

func InitDB() {
	var err error
	utils.PathExistsOrCreate("./data")
	// 创建数据库
	dir := "./data"
	dbPath := filepath.Join(dir, "nav.db")
	// 添加连接参数
	dbPath = dbPath + "?_journal=WAL&_timeout=5000&_busy_timeout=5000&_txlock=immediate"
	DB, err = sql.Open("sqlite", dbPath)
	utils.CheckErr(err)
	// user 表
	sql_create_table := `
		CREATE TABLE IF NOT EXISTS nav_user (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			password TEXT
		);
		`
	_, err = DB.Exec(sql_create_table)
	utils.CheckErr(err)
	// setting 表
	sql_create_table = `
	CREATE TABLE IF NOT EXISTS nav_setting (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		favicon TEXT,
		title TEXT,
		govRecord TEXT,
		logo192 TEXT,
		logo512 TEXT,
		hideAdmin BOOLEAN,
		hideGithub BOOLEAN,
		jumpTargetBlank BOOLEAN
	);
	`
	_, err = DB.Exec(sql_create_table)
	utils.CheckErr(err)
	// 检查并添加列
	if !columnExists("nav_setting", "logo192") {
		DB.Exec(`ALTER TABLE nav_setting ADD COLUMN logo192 TEXT;`)
	}
	if !columnExists("nav_setting", "logo512") {
		DB.Exec(`ALTER TABLE nav_setting ADD COLUMN logo512 TEXT;`)
	}
	if !columnExists("nav_setting", "govRecord") {
		DB.Exec(`ALTER TABLE nav_setting ADD COLUMN govRecord TEXT;`)
	}
	if !columnExists("nav_setting", "jumpTargetBlank") {
		DB.Exec(`ALTER TABLE nav_setting ADD COLUMN jumpTargetBlank BOOLEAN;`)
	}
	// 设置表表结构升级-20230628
	if !columnExists("nav_setting", "hideAdmin") {
		DB.Exec(`ALTER TABLE nav_setting ADD COLUMN hideAdmin BOOLEAN;`)
	}
	// 设置表表结构升级-20230627
	if !columnExists("nav_setting", "hideGithub") {
		DB.Exec(`ALTER TABLE nav_setting ADD COLUMN hideGithub BOOLEAN;`)
	}

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
	_, err = DB.Exec(sql_create_table)
	utils.CheckErr(err)

	// tools数据表结构升级-20230327
	if !columnExists("nav_table", "sort") {
		DB.Exec(`ALTER TABLE nav_table ADD COLUMN sort INTEGER;`)
	}

	// tools数据表结构升级-20230627
	if !columnExists("nav_table", "hide") {
		DB.Exec(`ALTER TABLE nav_table ADD COLUMN hide BOOLEAN;`)
	}

	// 分类表
	sql_create_table = `
		CREATE TABLE IF NOT EXISTS nav_catelog (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT
		);
			`
	_, err = DB.Exec(sql_create_table)
	utils.CheckErr(err)

	// 分类表表结构升级-20230327
	if !columnExists("nav_catelog", "sort") {
		DB.Exec(`ALTER TABLE nav_catelog ADD COLUMN sort INTEGER NOT NULL DEFAULT 0;`)
	}

	// 分类表表结构升级-20241219-【隐藏分类】
	if !columnExists("nav_catelog", "hide") {
		DB.Exec(`ALTER TABLE nav_catelog ADD COLUMN hide BOOLEAN;`)
	}
	migration_2024_12_13() // 只涉及 nav_catelog 表，所以可以放在这里

	// api token 表
	sql_create_table = `
		CREATE TABLE IF NOT EXISTS nav_api_token (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			value TEXT,
			disabled INTEGER
		);
		`
	_, err = DB.Exec(sql_create_table)
	utils.CheckErr(err)
	// img 表
	sql_create_table = `
		CREATE TABLE IF NOT EXISTS nav_img (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			url TEXT,
			value TEXT
		);
		`
	_, err = DB.Exec(sql_create_table)
	utils.CheckErr(err)

	// 搜索引擎表
	sql_create_table = `
		CREATE TABLE IF NOT EXISTS nav_search_engine (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			baseUrl TEXT NOT NULL,
			queryParam TEXT NOT NULL,
			logo TEXT,
			sort INTEGER NOT NULL DEFAULT 0,
			enabled BOOLEAN NOT NULL DEFAULT 1
		);
		`
	_, err = DB.Exec(sql_create_table)
	utils.CheckErr(err)

	// 网站配置表
	sql_create_table = `
		CREATE TABLE IF NOT EXISTS nav_site_config (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			noImageMode BOOLEAN NOT NULL DEFAULT 0
		);
		`
	_, err = DB.Exec(sql_create_table)
	utils.CheckErr(err)
	
	// 如果不存在，就初始化默认搜索引擎
	sql_get_search_engine := `
		SELECT COUNT(*) FROM nav_search_engine;
		`
	var searchEngineCount int
	err = DB.QueryRow(sql_get_search_engine).Scan(&searchEngineCount)
	utils.CheckErr(err)
	if searchEngineCount == 0 {
		// 初始化默认搜索引擎
		defaultEngines := []struct {
			name       string
			baseUrl    string
			queryParam string
			logo       string
			sort       int
		}{
			{"百度", "https://www.baidu.com/s", "wd", "baidu.ico", 1},
			{"Bing", "https://cn.bing.com/search", "q", "bing.ico", 2},
			{"Google", "https://www.google.com/search", "q", "google.ico", 3},
		}
		
		sql_add_search_engine := `
			INSERT INTO nav_search_engine (name, baseUrl, queryParam, logo, sort, enabled)
			VALUES (?, ?, ?, ?, ?, ?);
			`
		stmt, err := DB.Prepare(sql_add_search_engine)
		utils.CheckErr(err)
		defer stmt.Close()
		
		for _, engine := range defaultEngines {
			_, err = stmt.Exec(engine.name, engine.baseUrl, engine.queryParam, engine.logo, engine.sort, true)
			utils.CheckErr(err)
		}
		logger.LogInfo("默认搜索引擎初始化成功")
	}
	
	// 如果不存在，就初始化用户
	sql_get_user := `
		SELECT * FROM nav_user;
		`
	rows, err := DB.Query(sql_get_user)
	utils.CheckErr(err)
	if !rows.Next() {
		sql_add_user := `
			INSERT INTO nav_user (id, name, password)
			VALUES (?, ?, ?);
			`
		stmt, err := DB.Prepare(sql_add_user)
		utils.CheckErr(err)
		res, err := stmt.Exec(utils.GenerateId(), "admin", "admin")
		utils.CheckErr(err)
		_, err = res.LastInsertId()
		utils.CheckErr(err)
	}
	rows.Close()
	// 如果不存在设置，就初始化
	sql_get_setting := `
		SELECT * FROM nav_setting;
		`
	rows, err = DB.Query(sql_get_setting)
	utils.CheckErr(err)
	if !rows.Next() {
		sql_add_setting := `
			INSERT INTO nav_setting (favicon, title, govRecord, logo192, logo512, hideAdmin, hideGithub, jumpTargetBlank)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?);
			`
		stmt, err := DB.Prepare(sql_add_setting)
		utils.CheckErr(err)
		res, err := stmt.Exec("favicon.ico", "Van Nav", "", "logo192.png", "logo512.png", false, false, true)
		utils.CheckErr(err)
		_, err = res.LastInsertId()
		utils.CheckErr(err)
	}
	rows.Close()

	// 如果不存在网站配置，就初始化
	sql_get_site_config := `
		SELECT * FROM nav_site_config;
		`
	rows, err = DB.Query(sql_get_site_config)
	utils.CheckErr(err)
	if !rows.Next() {
		sql_add_site_config := `
			INSERT INTO nav_site_config (noImageMode)
			VALUES (?);
			`
		stmt, err := DB.Prepare(sql_add_site_config)
		utils.CheckErr(err)
		res, err := stmt.Exec(false)
		utils.CheckErr(err)
		_, err = res.LastInsertId()
		utils.CheckErr(err)
	}
	rows.Close()
	logger.LogInfo("数据库初始化成功💗")

	// 清理空分类记录 - 删除名称为空或只包含空白字符的分类
	cleanupEmptyCategories()
}

// cleanupEmptyCategories 清理空分类记录
func cleanupEmptyCategories() {
	// 删除名称为空或只包含空白字符的分类记录
	sql_cleanup := `
		DELETE FROM nav_catelog 
		WHERE name IS NULL OR name = '' OR TRIM(name) = '';
	`
	result, err := DB.Exec(sql_cleanup)
	if err != nil {
		logger.LogInfo("清理空分类记录时出错: %v", err)
		return
	}
	
	rowsAffected, err := result.RowsAffected()
	if err == nil && rowsAffected > 0 {
		logger.LogInfo("已清理 %d 条空分类记录", rowsAffected)
	}
}
