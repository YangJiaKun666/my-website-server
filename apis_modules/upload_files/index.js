const express = require('express')
// 引入multer 处理文件上传的中间件
const multer = require('multer')
// 创建路由模块
const router = express.Router()
// 处理文件上传是保存文件的路径
let storage = multer.diskStorage({
    destination: function (req, file, cd) {
        cd(null, 'public/images')
    },
    filename: function (req, file, cd) {
        cd(null, `${Date.now()}-${file.originalname}`)
    },
})
let upload = multer({ storage })
/**
 * 上传图片
 */
router.post('/uploadImage', upload.array('file', 40), (req, res) => {
    let files = req.files
    if (files[0]) {
        res.send({
            code: 200,
            msg: 'success',
            data: {
                imgUrl: `http://127.0.0.1:3000/${files[0].destination.replace(
                    /\.\//,
                    ''
                )}/${files[0].filename}`,
            },
        })
    } else {
        res.send({ code: 4001, msg: '图片上传失败' })
    }
})
module.exports = router
