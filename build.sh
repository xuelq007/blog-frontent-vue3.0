#!/bin/bash
cd /usr/blog/blog-frontent-vue3.0
echo 'pull from git'
git pull origin master
echo 'pull from git done!'
echo 'start building'
npx run build
echo 'travis build done!'
