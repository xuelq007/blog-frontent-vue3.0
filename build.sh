#!/bin/bash
cd /usr/blog/blog-frontent-vue3.0
echo 'pull from git'
git pull origin master
echo 'pull from git done!'
echo 'start building'
export PATH=/root/.nvm/versions/node/v8.11.1/bin:$PATH
npm run build
echo 'travis build done!'
