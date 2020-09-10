const express = require('express')
// 引入mysql连接池
const pool = require('../../connection')
// 创建路由模块
const router = express.Router()
/**
 * 获取最新上传的十条文章数据
 */
router.get('/getArticle', (req, res) => {
    let sql = 'SELECT * FROM article ORDER BY createTime DESC LIMIT 10'
    pool.query(sql, [], function (err, sqlRes) {
        if (err) return res.send({ code: 5000, msg: err.sqlMessage})
        let selectRes = sqlRes
        res.send({ code: 1000, msg: 'success', data: selectRes || [] })
    })
})
/**
 * 根据条件查询文章
 * @param { classId } 分类id,不传入则是查询全部
 * @param { keyCode } 查询关键字，不传入则是查询全部
 * @param { pageNum } 页数，不传入怎是第一页
 * @param { pageSize } 每页数量，不传入则是默认十条数据
 */
router.get('/getArticleByKeycode', (req, res) => {
    if (JSON.stringify(req.query) === '{}') {
        return res.send({
            code: 4000,
            msg: '参数错误，请确认是否传入正确的参数',
        })
    }
    let classId = Number(req.query.classId) || '%' // 分类id
    let keyCode = req.query.keyCode ? '%' + req.query.keyCode + '%' : '%' // 关键字
    let pageSize = Number(req.query.pageSize) || 10 // 每页的数量
    let pageNum = (req.query.pageNum - 1 || 0) * pageSize // 页数索引
    let sql = `SELECT * FROM article WHERE classId like ? and title like ? LIMIT ?, ?`
    pool.query(sql, [classId, keyCode, pageNum, pageSize], function (
        err,
        sqlRes
    ) {
        if (err) return res.send({ code: 5000, msg: err.sqlMessage})
        let selectRes = sqlRes
        res.send({ code: 1000, msg: 'success', data: selectRes || [] })
    })
})
/**
 * 查询文章详情
 * @param { id } 文章id
 */
router.get('/getArticleDetail', (req, res) => {
    if (!req.query.id) {
        return res.send({
            code: 400,
            msg: '参数错误，请确认是否传入正确的参数',
        })
    }
    let id = req.query.id // 文章id
    let sql = `SELECT * FROM article WHERE id like ? `
    pool.query(sql, [id], function (err, sqlRes) {
        if (err) return res.send({ code: 5000, msg: err.sqlMessage})
        if (sqlRes[0]) {
            res.send({ code: 1000, msg: 'success', data: sqlRes[0] })
        } else {
            res.send({ code: 4002, msg: '未找到符合条件的资源' })
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
router.post('/insertArticle', (req, res) => {
    console.log('req', req.body)
    let body = req.body
    let id = Date.now() + '' + parseInt(Math.random() * 1000)
    console.log(id)
    let sql =
        'INSERT INTO article (id, title, create_time,class_id,class_name,decs) VALUES (?, ?, ?, ?, ?, ?);'
    let valueArr = [
        id,
        body.title,
        body.createTime,
        body.classId,
        body.className,
        body.content,
    ]
    console.log(valueArr)
    pool.query(sql, valueArr, function (err, sqlRes) {
        if (err) return res.send({ code: 5000, msg: err.sqlMessage})
        if (sqlRes) {
            res.send({ code: 1000, msg: 'success' })
        } else {
            res.send({ code: 4004, msg: '添加失败' })
        }
    })
})
module.exports = router
