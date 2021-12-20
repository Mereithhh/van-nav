echo "清空原有数据"
rm -rf public/*
mkdir public/admin
echo '构建用户页面'
cd ui/website && pnpm build && cd ../../
rsync -r -P ui/website/build/* public/
echo '构建管理页面'
cd ui/admin && pnpm build && cd ../../
rsync -r -P ui/admin/dist/* public/admin/
echo "构建后端，打包一起"
CGO_ENABLED=1 GOOS=darwin GOARCH=amd64 go build -o release/mac/amd64/van-nav
CGO_ENABLED=1 GOOS=darwin GOARCH=arm64 go build -o release/mac/arm64/van-nav
CGO_ENABLED=1 GOOS=linux GOARCH=amd64 go build -o release/linux/amd64/van-nav
CGO_ENABLED=1 GOOS=linux GOARCH=arm64 go build -o release/linux/arm64/van-nav
CGO_ENABLED=1 GOOS=freebsd GOARCH=amd64 go build -o release/freebsd/amd64/van-nav
CGO_ENABLED=1 GOOS=windows GOARCH=arm64 go build -o release/windows/arm64/van-nav.exe
CGO_ENABLED=1 GOOS=windows GOARCH=amd64 go build -o release/windows/amd64/van-nav.exe
CGO_ENABLED=1 GOOS=windows GOARCH=386 go build -o release/windows/386/van-nav.exe
echo "完成"


