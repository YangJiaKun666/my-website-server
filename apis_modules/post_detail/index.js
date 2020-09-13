const express = require('express')
// 引入mysql连接池
const pool = require('../../connection')
const { route } = require('../tags')
// 创建路由模块
const router = express.Router()
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
    let sql = `SELECT * FROM article WHERE id like ?;`
    pool.query(sql, [id], function (err, sqlRes) {
        if (err) return res.send({ code: 5000, msg: err.sqlMessage })
        if (sqlRes[0]) {
            res.send({ code: 1000, msg: 'success', data: sqlRes[0] })
        } else {
            res.send({ code: 4002, msg: '未找到符合条件的资源' })
        }
    })
})
/**
 * 新增文章
 * @param { title } 文章标题
 * @param { createTime } 文章创建时间
 * @param { content } 文章内容
 * @param { classId } 文章标签id
 * @param { className } 文章标签名称
 */
router.post('/insertArticle', (req, res) => {
    let body = req.body
    let id = Date.now() + '' + parseInt(Math.random() * 1000)
    let sql = `INSERT INTO article (id, title, createTime,classId,className,decs) VALUES (${id}, '${body.title}', '${body.createTime}', ${body.classId}, '${body.className}', '${body.content}');`
    pool.query(sql, function (err, sqlRes) {
        if (err) return res.send({ code: 5000, msg: err.sqlMessage })
        if (sqlRes) {
            res.send({ code: 1000, msg: 'success' })
        } else {
            res.send({ code: 4004, msg: '添加失败' })
        }
    })
})
/**
 * 编辑文章
 * @param { id } 文章id
 * @param { title } 文章标题
 * @param { createTime } 文章创建时间
 * @param { content } 文章内容
 * @param { classId } 文章标签id
 * @param { className } 文章标签名称
 */
router.post('/updateArticle', (req, res) => {
    let body = req.body
    let sql = `UPDATE article SET title = '${body.title}', createTime = '${body.createTime}', classId = ${body.classId}, decs = '${body.content}', className = '${body.className}' WHERE id = ${body.id};`
    pool.query(sql, (err, sqlRes) => {
        if (err) return res.send({ code: 5000, msg: err.sqlMessage })
        res.send({ code: 1000, msg: 'success' })
    })
})
/**
 * 删除文章
 * @param { id } 文章id
 */
router.post('/deleteArticle', (req, res) => {
    let id = req.body.id
    let sql = `DELETE FROM article WHERE id = ${id};`
    pool.query(sql, (err, sqlRes) => {
        if (err) return res.send({ code: 5000, msg: err.sqlMessage })
        res.send({ code: 1000, msg: 'success' })
    })
})
module.exports = router
