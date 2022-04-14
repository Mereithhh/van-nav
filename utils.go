package main

import (
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"net/http"
)

func checkErr(err error) {
	if err != nil {
		fmt.Println("捕获到错误：", err)
	}
}
func in(target string, str_array []string) bool {
	for _, element := range str_array {
		if target == element {
			return true
		}
	}
	return false
}

func getImgBase64FromUrl(url string) string {
	imgUrl := url
	//获取远端图片
	res, err := http.Get(imgUrl)
	if err != nil {
		checkErr(err)
		return ""
	}
	defer res.Body.Close()

	// 读取获取的[]byte数据
	data, _ := ioutil.ReadAll(res.Body)

	imageBase64 := base64.StdEncoding.EncodeToString(data)
	return imageBase64
}
