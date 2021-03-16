const Sequelize = require("sequelize").Sequelize;

const sequelize =  new Sequelize('nodeShop', 'raman', 'raman08', {
	dialect: 'mysql',
	host: 'localhost'
});

module.exports = sequelize;