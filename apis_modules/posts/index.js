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
    pool.query(sql, function (err, sqlRes) {
        if (err) return res.send({ code: 5000, msg: err.sqlMessage })
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
    let classId = req.query.classId || "'%'" // 分类id
    let keyCode = req.query.keyCode ? `'%${req.query.keyCode}%'` : "'%'" // 关键字
    let pageSize = Number(req.query.pageSize) || 10 // 每页的数量
    let pageNum = (req.query.pageNum - 1 || 0) * pageSize // 页数索引
    let key = `classId like ${classId} and title like ${keyCode}` // 查询条件
    let selectSql = `SELECT * FROM article WHERE ${key} LIMIT ${pageNum}, ${pageSize};` // 获取满足条件的数据
    let totalSql = `SELECT sum(${key}) FROM article;` // 获取满足条件的总数
    pool.query(selectSql, function (selectSqlErr, selectSqlRes) {
        if (selectSqlErr)
            return res.send({ code: 5000, msg: selectSqlErr.sqlMessage })
        pool.query(totalSql, function (totalSqlErr, totalSqlRes) {
            if (totalSqlErr)
                return res.send({ code: 5000, msg: totalSqlErr.sqlMessage })
            let selectRes = selectSqlRes
            let obj = {
                pageNum: pageNum + 1,
                pageSize,
                total: totalSqlRes[0][`sum(${key})`],
            }
            res.send({
                code: 1000,
                msg: 'success',
                data: selectRes || [],
                ...obj,
            })
        })
    })
})
module.exports = router
