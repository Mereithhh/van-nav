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
