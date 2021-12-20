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
go build .
echo "完成"


