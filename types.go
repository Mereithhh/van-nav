package main

type loginDto struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

// 默认是 0
type Setting struct {
	Id      int    `json:"id"`
	Favicon string `json:"favicon"`
	Title   string `json:"title"`
	Logo192 string `json:"logo192"`
	Logo512 string `json:"logo512"`
}

type Token struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Value    string `json:"value"`
	Disabled int    `json:"disabled"`
}
type AddTokenDto struct {
	Name string `json:"name"`
}
type User struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Password string `json:"password"`
}
type Img struct {
	Id    int    `json:"id"`
	Url   string `json:"url"`
	Value string `json:"value"`
}

type resUserDto struct {
	Name string `json:"name"`
}

type updateUserDto struct {
	Id       int64  `json:"id"`
	Name     string `json:"name"`
	Password string `json:"password"`
}

type Tool struct {
	Id      int    `json:"id"`
	Name    string `json:"name"`
	Url     string `json:"url"`
	Logo    string `json:"logo"`
	Catelog string `json:"catelog"`
	Desc    string `json:"desc"`
}

type addToolDto struct {
	Name    string `json:"name"`
	Url     string `json:"url"`
	Logo    string `json:"logo"`
	Catelog string `json:"catelog"`
	Desc    string `json:"desc"`
}

type updateToolDto struct {
	Id      int    `json:"id"`
	Name    string `json:"name"`
	Url     string `json:"url"`
	Logo    string `json:"logo"`
	Catelog string `json:"catelog"`
	Desc    string `json:"desc"`
}
type updateCatelogDto struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

type addCatelogDto struct {
	Name string `json:"name"`
}

type Catelog struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}
