#!/bin/bash -xe

version=`git log --pretty=format:'%h' -n 1`

rm -rf dist

cp -r server dist
rm dist/public
cp -r client/dist dist/public

perl -i -pe "s/const VERSION = 'dev'/const VERSIOn = '$version'/" dist/src/app.js

git subtree push --prefix dist heroku master
