const express = require('express')
// 引入mysql连接池
const pool = require('../../connection')
const { route } = require('../posts')
// 创建路由模块
const router = express.Router()
/**
 * 获取所有分类
 */
router.get('/getClassIfication', (req, res) => {
    let sql = 'SELECT * FROM classification;'
    pool.query(sql, function (err, sqlRes) {
        if (err) return res.send({ code: 5000, msg: err.sqlMessage })
        let selectRes = sqlRes
        res.send({ code: 1000, msg: 'success', data: selectRes || [] })
    })
})
/**
 * 新增分类
 * @param { className } 分类名
 */
router.post('/insertClass', (req, res) => {
    let classId = Date.now() + '' + parseInt(Math.random() * 1000)
    let className = req.body.className
    let sql = `INSERT INTO classification (classId, className) VALUE (${classId}, '${className}');`
    pool.query(sql, (err, sqlRes) => {
        if (err) return res.send({ code: 5000, msg: err.sqlMessage })
        res.send({ code: 1000, msg: 'success' })
    })
})
/**
 * 修改分类
 * @param { classId } 分类id
 * @param { className } 分类名称
 */
router.post('/updateClass', (req, res) => {
    let classId = req.body.classId
    let className = req.body.className
    let sql = `UPDATE classification SET className = '${className}' WHERE classId = ${classId};`
    pool.query(sql, (err, sqlRes) => {
        if (err) return res.send({ code: 5000, msg: err.sqlMessage })
        res.send({ code: 1000, msg: 'success' })
    })
})
/**
 * 删除分类
 * @param { classId } 分类id
 */
router.post('/deleteClass', (req, res) => {
    let classId = req.body.classId
    let sql = `DELETE FROM classification WHERE classId = ${classId};`
    pool.query(sql, (err, sqlRes) => {
        if (err) return res.send({ code: 5000, msg: err.sqlMessage })
        res.send({ code: 1000, msg: 'success' })
    })
})
module.exports = router
