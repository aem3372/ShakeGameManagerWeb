# ShakeGameManagerWeb

## 依赖安装

安装并启动redis和mongodb

```
npm install
```

## 运行

```
node bin/www
```

## 其他

创建用户脚本(去除app.js的注释，重新启动服务器)
```
// create default user
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
var User = require('./models/user');
new User({
  name: 'admin',
  password: md5.update('admin').digest('base64')
}).save(function(err) {
});
```