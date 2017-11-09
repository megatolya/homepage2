#!/bin/sh

author=`node -p -e 'require("./package.json").author'`
docker_project_name=`node -p -e 'require("./package.json").name'`
build_number=${1:-'latest'}
echo "building $docker_project_name/$build_number"

docker build \
    --build-arg version=$build_number \
    --build-arg app_key="$(cat package.json | md5)" \
    --label maintainer="$author" \
    -t $docker_project_name:$build_number \
    .
