const express = require('express')
// 引入mysql连接池
const pool = require('../../connection')
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
    let sql = `SELECT * FROM article WHERE id like ? `
    pool.query(sql, [id], function (err, sqlRes) {
        if (err) return res.send({ code: 5000, msg: err.sqlMessage })
        if (sqlRes[0]) {
            res.send({ code: 1000, msg: 'success', data: sqlRes[0] })
        } else {
            res.send({ code: 4002, msg: '未找到符合条件的资源' })
        }
    })
})
module.exports = router
