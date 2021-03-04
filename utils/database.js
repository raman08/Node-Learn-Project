const mysql = require('mysql2');

const pool = mysql.createPool({
	host: 'localhost',
	user: 'raman',
	database: 'nodeShop',
	password: 'raman08'
});

module.exports = pool.promise();