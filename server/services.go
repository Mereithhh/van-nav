package main

import "database/sql"

func getToolLogoUrlById(id int, db *sql.DB) string {
	sql_get_tool := `
		SELECT logo FROM nav_table WHERE id=?;
		`
	rows, err := db.Query(sql_get_tool, id)
	checkErr(err)
	var tool Tool
	for rows.Next() {
		err = rows.Scan(&tool.Logo)
		checkErr(err)

	}
	defer rows.Close()
	return tool.Logo
}

func updateToolIcon(id int64, logo string, db *sql.DB) {
	sql_update_tool := `
		UPDATE nav_table SET logo=? WHERE id=?;
		`
	_, err := db.Exec(sql_update_tool, logo, id)
	checkErr(err)
	updateImg(logo, db)
}

func LazyFetchLogo(url string, id int64, db *sql.DB) {
	// 如果 logo 为空，就去获取 logo
	logo := getIcon(url)
	updateToolIcon(id, logo, db)
}
