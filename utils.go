package main

import "fmt"

func checkErr(err error) {
	if err != nil {
		fmt.Println("捕获到错误：", err)
	}
}
