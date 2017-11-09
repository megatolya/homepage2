Local development
```sh
npm install
npm start
```

Docker image
```sh
./build 0.0.1
docker run -p 3002:80 -t -i vue-boilerplate:0.0.1
# Project name and author are taken from `package.json`. Version is not.
```
