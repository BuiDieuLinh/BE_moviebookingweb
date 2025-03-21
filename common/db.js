// đọc csdl
var mysql = require('mysql2');
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "linh",
    database: "movie_ticket_booking"
})
module.exports = db;