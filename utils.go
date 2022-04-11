package main

import "fmt"

func checkErr(err error) {
	if err != nil {
		fmt.Println("捕获到错误：", err)
	}
}
func in(target string, str_array []string) bool {
	for _, element := range str_array{
		if target == element{
			return true
		}
	}
	return false
}