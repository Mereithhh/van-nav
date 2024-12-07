package service

import (
	"github.com/mereith/nav/database"
	"github.com/mereith/nav/types"
	"github.com/mereith/nav/utils"
)

func GetSetting() types.Setting {
	sql_get_user := `
		SELECT id,favicon,title,govRecord,logo192,logo512,hideAdmin,hideGithub,jumpTargetBlank FROM nav_setting WHERE id = ?;
		`
	var setting types.Setting
	row := database.DB.QueryRow(sql_get_user, 0)
	// 建立一个空变量
	var hideGithub interface{}
	var hideAdmin interface{}
	var jumpTargetBlank interface{}
	err := row.Scan(&setting.Id, &setting.Favicon, &setting.Title, &setting.GovRecord, &setting.Logo192, &setting.Logo512, &hideAdmin, &hideGithub, &jumpTargetBlank)
	if err != nil {
		return types.Setting{
			Id:              0,
			Favicon:         "favicon.ico",
			Title:           "Van Nav",
			GovRecord:       "",
			Logo192:         "logo192.png",
			Logo512:         "logo512.png",
			HideAdmin:       false,
			HideGithub:      false,
			JumpTargetBlank: true,
		}
	}
	if hideGithub == nil {
		setting.HideGithub = false
	} else {
		if hideGithub.(int64) == 0 {
			setting.HideGithub = false
		} else {
			setting.HideGithub = true
		}
	}
	if hideAdmin == nil {
		setting.HideAdmin = false
	} else {
		if hideAdmin.(int64) == 0 {
			setting.HideAdmin = false
		} else {
			setting.HideAdmin = true
		}
	}

	if jumpTargetBlank == nil {
		setting.JumpTargetBlank = true
	} else {
		if jumpTargetBlank.(int64) == 0 {
			setting.JumpTargetBlank = false
		} else {
			setting.JumpTargetBlank = true
		}
	}

	return setting
}

func UpdateSetting(data types.Setting) {
	sql_update_setting := `
		UPDATE nav_setting
		SET favicon = ?, title = ?, govRecord = ?, logo192 = ?, logo512 = ?, hideAdmin = ?, hideGithub = ?, jumpTargetBlank = ?
		WHERE id = ?;
		`

	stmt, err := database.DB.Prepare(sql_update_setting)
	utils.CheckErr(err)
	res, err := stmt.Exec(data.Favicon, data.Title, data.GovRecord, data.Logo192, data.Logo512, data.HideAdmin, data.HideGithub, data.JumpTargetBlank, 0)
	utils.CheckErr(err)
	_, err = res.RowsAffected()
	utils.CheckErr(err)
}
