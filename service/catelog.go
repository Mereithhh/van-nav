package service

import (
	"github.com/mereith/nav/database"
	"github.com/mereith/nav/types"
	"github.com/mereith/nav/utils"
)

func UpdateCatelog(data types.UpdateCatelogDto) {

	// 查询分类原名称
	sql_select_old_catelog_name := `select name from nav_catelog where id = ?;`
	var oldName string
	err := database.DB.QueryRow(sql_select_old_catelog_name, data.Id).Scan(&oldName)
	utils.CheckErr(err)

	// 开启事务
	tx, err := database.DB.Begin()
	utils.CheckErr(err)

	// 更新分类新名称
	sql_update_catelog := `
		UPDATE nav_catelog
		SET name = ?, sort = ?, hide = ?
		WHERE id = ?;
		`
	stmt, err := tx.Prepare(sql_update_catelog)
	utils.CheckTxErr(err, tx)
	res, err := stmt.Exec(data.Name, data.Sort, data.Hide, data.Id)
	utils.CheckTxErr(err, tx)
	_, err = res.RowsAffected()
	utils.CheckTxErr(err, tx)

	if oldName != data.Name {
		// 更新工具分类新名称
		sql_update_tools := `
		UPDATE nav_table
		SET catelog = ?
		WHERE catelog = ?;
		`
		stmt2, err := tx.Prepare(sql_update_tools)
		utils.CheckTxErr(err, tx)
		res2, err := stmt2.Exec(data.Name, oldName)
		utils.CheckTxErr(err, tx)
		_, err = res2.RowsAffected()
		utils.CheckTxErr(err, tx)
	}
	// 提交事务
	err = tx.Commit()
	utils.CheckErr(err)
}

func AddCatelog(data types.AddCatelogDto) {
	// 先检查重复不重复
	existCatelogs := GetAllCatelog()
	var existCatelogsArr []string
	for _, catelogDto := range existCatelogs {
		existCatelogsArr = append(existCatelogsArr, catelogDto.Name)
	}
	if utils.In(data.Name, existCatelogsArr) {
		return
	}
	sql_add_catelog := `
		INSERT INTO nav_catelog (name,sort,hide)
		VALUES (?,?,?);
		`
	stmt, err := database.DB.Prepare(sql_add_catelog)
	utils.CheckErr(err)
	res, err := stmt.Exec(data.Name, data.Sort, data.Hide)
	utils.CheckErr(err)
	_, err = res.LastInsertId()
	utils.CheckErr(err)
}

func GetAllCatelog() []types.Catelog {
	sql_get_all := `
		SELECT id,name,sort,hide FROM nav_catelog order by sort;
	`
	results := make([]types.Catelog, 0)
	rows, err := database.DB.Query(sql_get_all)
	utils.CheckErr(err)
	for rows.Next() {
		var catelog types.Catelog
		err = rows.Scan(&catelog.Id, &catelog.Name, &catelog.Sort, &catelog.Hide)
		utils.CheckErr(err)
		results = append(results, catelog)
	}
	defer rows.Close()
	return results
}
