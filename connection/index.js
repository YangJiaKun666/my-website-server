const mysql = require('mysql')
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123',
    port: '3306',
    database: 'blogdatabase',
    connectionLimit: 20,
})
module.exports = pool
