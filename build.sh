#!/bin/bash
cd /usr/blog/blog-frontent-vue3.0
git pull origin master
npm run build
echo 'travis build done!