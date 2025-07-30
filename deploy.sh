#!/usr/bin/env sh
# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
pnpm run build

# 进入生成的文件夹
cd src/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
# git push -f <EMAIL>:<USERNAME>/<USERNAME>.github.io.git master
git push -f https://github.com/along-h/my-blob.git master:gh-pages # 推送到 gh-pages 分支

cd -