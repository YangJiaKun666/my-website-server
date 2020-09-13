# install ...

```
npm install
```

# runing ...

```
nodemon app.js
```

# 文件结构说明

```
my-blog-server  项目目录

    app.js  入口文件

    connection

        index.js  mysql连接池

    api_modules  路由模块集合

        ······  各路由模块（如：tags、posts、...）

            index.js  路由模块入口文件

    public  静态资源文件夹

        images  图片文件夹

    blog.sql  数据库结构文件

    package-lock.json

    node_modules

    README.md  说明文档

    .gitignore

```

# 后台服务器返回的状态码

1xxx

```
1000: 操作成功
```

4xxx

```
4000: 参数错误
4001: 文件/图片上传失败
4002: 资源不存在
4004: 数据添加失败
```

5xxx

```
5000: 服务器错误
```
