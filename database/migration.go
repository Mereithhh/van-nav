package database

func migration_2024_12_13() {
	// 1. 首先更新现有的 NULL 值为 0
	sql_update_null_sort := `
        UPDATE nav_catelog 
        SET sort = 0 
        WHERE sort IS NULL;
    `

	_, err := DB.Exec(sql_update_null_sort)
	if err != nil {
		panic(err)
	}

	// 2. 创建新表
	sql_create_new_table := `
        CREATE TABLE nav_catelog_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            sort INTEGER NOT NULL DEFAULT 0,
						hide BOOLEAN
        );
    `

	_, err = DB.Exec(sql_create_new_table)
	if err != nil {
		panic(err)
	}

	// 3. 复制数据
	sql_copy_data := `
        INSERT INTO nav_catelog_new (id, name, sort, hide)
        SELECT id, name, sort, hide FROM nav_catelog;
    `

	_, err = DB.Exec(sql_copy_data)
	if err != nil {
		panic(err)
	}

	// 4. 删除旧表
	sql_drop_old_table := `DROP TABLE nav_catelog;`

	_, err = DB.Exec(sql_drop_old_table)
	if err != nil {
		panic(err)
	}

	// 5. 重命名新表
	sql_rename_table := `ALTER TABLE nav_catelog_new RENAME TO nav_catelog;`

	_, err = DB.Exec(sql_rename_table)
	if err != nil {
		panic(err)
	}
}
