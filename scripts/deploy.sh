#!/bin/bash -xe

rm -rf dist

cp -r server dist
rm dist/public
cp -r client/dist dist/public

git subtree push --prefix dist heroku master
