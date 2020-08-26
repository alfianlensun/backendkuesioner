
const mysql = require('mysql');

const database = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'kuesioner'
});


module.exports = {
    database
}