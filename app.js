//引入express
const express = require('express')
//处理跨域
const cors = require('cors')
// 创建实例
const app = express()
// 引入multer 处理文件上传的中间件
const multer = require('multer')
// 引入bodyparser 处理post请求的中间件
const bodyParse = require('body-parser');
const path = require('path')
const pool = require('./connection')
app.use(cors('127.0.0.1:3000'))
app.listen(3000)
app.use('/public/images', express.static('./public/images'))

let storage = multer.diskStorage({
    destination: function (req, file, cd) {
        cd(null, './public/images')
    },
    filename: function (req, file, cd) {
        cd(null, `${Date.now()}-${file.originalname}`)
    }
})
let upload = multer({ storage })
/**
 * 上传图片
 */
app.post('/uploadFile', upload.array('file', 40), (req, res) => {
    console.log('uploadFile', req.files)
    let files = req.files
    if (files[0]) {
        res.send({
            code: 200, msg: 'success', data: { imgUrl: `http://127.0.0.1:3000/${files[0].destination.replace(/\.\//, '')}/${files[0].filename}` }
        })
    } else {
        res.send({ code: 202, msg: 'upload error' })
    }
})

/**
 * 获取所有分类
 */
app.get('/getClassIfication', (req, res) => {
    let sql = 'SELECT * FROM classification'
    pool.query(sql, [], function (err, sqlRes) {
        if (err) throw err
        let selectRes = sqlRes.map(ele => {
            return { classId: ele.class_id, className: ele.class_name }
        })
        res.send({ code: 200, msg: 'success', data: selectRes })
    })
})
/**
 * 获取最新上传的十条文章数据
 */
app.get('/getArticle', (req, res) => {
    let sql = 'SELECT * FROM article ORDER BY create_time DESC LIMIT 10'
    pool.query(sql, [], function (err, sqlRes) {
        if (err) throw err
        let selectRes = sqlRes.map(ele => {
            return {
                ...ele
            }
        })
        res.send({ code: 200, msg: 'success', data: selectRes })
    })
})
/**
 * 根据条件查询文章
 * @param { classId } 分类id,不传入则是查询全部
 * @param { keyCode } 查询关键字，不传入则是查询全部
 * @param { pageNum } 页数，不传入怎是第一页
 * @param { pageSize } 每页数量，不传入则是默认十条数据
 */
app.get('/getArticleByKeycode', (req, res) => {
    if (JSON.stringify(req.query) === "{}") {
        return res.send({ code: 400, msg: '参数错误，请确认是否传入正确的参数' })
    }
    let classId = Number(req.query.classId) || '%' // 分类id
    let keyCode = req.query.keyCode ? '%' + req.query.keyCode + '%' : '%' // 关键字
    let pageSize = Number(req.query.pageSize) || 10 // 每页的数量
    let pageNum = (req.query.pageNum - 1 || 0) * pageSize // 页数索引
    let sql = `SELECT * FROM article WHERE class_id like? and title like? LIMIT?,?`
    pool.query(sql, [classId, keyCode, pageNum, pageSize], function (err, sqlRes) {
        if (err && err.sqlMessage === 'Query was empty') {
            res.send({ res: 200, msg: 'success', data: [] })
        } else if (err && err.sqlMessage !== 'Query was empty') throw err
        let selectRes = sqlRes.map(ele => {
            return {
                ...ele
            }
        })
        res.send({ code: 200, msg: 'success', data: selectRes })
    })
})
/**
 * 查询文章详情
 * @param { id } 文章id
 */
app.get('/getArticleDetail', (req, res) => {
    if (!req.query.id) {
        return res.send({ code: 400, msg: '参数错误，请确认是否传入正确的参数' })
    }
    let id = req.query.id // 文章id
    let sql = `SELECT * FROM article WHERE id like ? `
    pool.query(sql, [id], function (err, sqlRes) {
        if (err) throw err
        console.log(sqlRes)
        if (sqlRes[0]) {
            res.send({ code: 200, msg: 'success', data: sqlRes[0] })
        } else {
            res.send({ code: 201, msg: '未找到符合条件的资源' })
        }
    })
})
/**
 * 新增帖子
 * @param { title } 文章标题 
 * @param { createTime } 文章创建时间 
 * @param { content } 文章内容 
 * @param { classId } 文章标签id  
 * @param { className } 文章标签名称  
 */