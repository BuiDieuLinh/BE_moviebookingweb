// đọc csdl
var mysql = require('mysql2');
var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "linh",
    database: "movie_ticket_booking",
    timezone: '+07:00',
    dateStrings: true
})
module.exports = db;