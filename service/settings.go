package service

import (
	"github.com/mereith/nav/database"
	"github.com/mereith/nav/logger"
	"github.com/mereith/nav/types"
)

func GetSetting() types.Setting {
	sql_get_user := `
		SELECT id,favicon,title,govRecord,logo192,logo512,hideAdmin,hideGithub,jumpTargetBlank 
		FROM nav_setting 
		ORDER BY id ASC 
		LIMIT 1;
		`
	var setting types.Setting
	row := database.DB.QueryRow(sql_get_user, 0)
	// 建立一个空变量
	var hideGithub interface{}
	var hideAdmin interface{}
	var jumpTargetBlank interface{}
	err := row.Scan(&setting.Id, &setting.Favicon, &setting.Title, &setting.GovRecord, &setting.Logo192, &setting.Logo512, &hideAdmin, &hideGithub, &jumpTargetBlank)
	if err != nil {
		logger.LogError("获取配置失败: %s", err)
		return types.Setting{
			Id:              1,
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

func UpdateSetting(data types.Setting) error {
	sql_update_setting := `
		UPDATE nav_setting
		SET favicon = ?, title = ?, govRecord = ?, logo192 = ?, logo512 = ?, hideAdmin = ?, hideGithub = ?, jumpTargetBlank = ?
		WHERE id = (SELECT id FROM nav_setting ORDER BY id ASC LIMIT 1);
		`

	stmt, err := database.DB.Prepare(sql_update_setting)
	if err != nil {
		return err
	}
	res, err := stmt.Exec(data.Favicon, data.Title, data.GovRecord, data.Logo192, data.Logo512, data.HideAdmin, data.HideGithub, data.JumpTargetBlank)
	if err != nil {
		return err
	}
	_, err = res.RowsAffected()
	if err != nil {
		return err
	}
	return nil
}
