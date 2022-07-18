require('dotenv').config();

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    port: process.env.SQL_PORT || 3306,
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting to MYSQL: ' + err.message);
        return;
    }
    console.log('Connected to MYSQL database');
    //test connection using arithmetic operation
    connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
        if (err) {
            console.error('Error performing query: ' + err.message);
            return;
        }
        console.log('SQL Arithmetic operation result: ' + rows[0].solution);
        console.log('The database connection is working normally.');
    });
});




module.exports = connection;