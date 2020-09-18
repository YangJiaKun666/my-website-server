//引入express
const express = require('express')
//引入跨域资源共享模块
const cors = require('cors')
// 创建实例
const app = express()
// 引入bodyparser 处理post请求的中间件
const bodyParser = require('body-parser')
// 处理跨域
app.use(cors('127.0.0.1:3001'))
// 设置监听端口
app.listen(3001)
// 设置静态资源文件夹
app.use('/public/images', express.static('./public/images'))
// post请求时，转换数据
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// 导入路由模块并使用
const routes = [
    // 文件上传模块
    { name: '/file', path: require('./apis_modules/upload_files') },
    // 标签模块
    { name: '/tags', path: require('./apis_modules/tags') },
    // 文章模块
    { name: '/posts', path: require('./apis_modules/posts') },
    // 文章详情模块
    { name: '/postDetail', path: require('./apis_modules/post_detail') },
]
routes.forEach((route) => {
    app.use(route.name, route.path)
})
