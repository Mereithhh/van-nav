git add .
git commit -m $2
git tag -a $1 -m $2
git push
git push origin --tags