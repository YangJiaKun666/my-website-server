const express = require('express')
// 引入mysql连接池
const pool = require('../../connection')
// 创建路由模块
const router = express.Router()
/**
 * 获取所有分类
 */
router.get('/getClassIfication', (req, res) => {
    let sql = 'SELECT * FROM classification'
    pool.query(sql, [], function (err, sqlRes) {
        if (err) return res.send({ code: 5000, msg: err.sqlMessage})
        let selectRes = sqlRes
        res.send({ code: 1000, msg: 'success', data: selectRes || [] })
    })
})

module.exports = router
