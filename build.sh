
echo "清空原有数据"
rm -rf ./public
mkdir -p public/admin
echo '构建用户页面'
cd ui/website && yarn build && cd ../../
cp -r ui/website/build/* public/
echo '构建管理页面'
cd ui/admin &&  yarn build && cd ../../
cp -r ui/admin/dist/* public/admin/
sed -i 's/\/assets/\/admin\/assets/g' public/admin/index.html
echo '构建前端数据完成'

go build .