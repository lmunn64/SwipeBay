const mysql = require('mysql2/promise')
const db = mysql. createPool({
host: "127.0.0.1",
user: "root",
password: "Slicker1!",
database: "swipebay"
})
module.exports = db;