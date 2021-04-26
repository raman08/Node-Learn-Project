const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;
const url =
	'mongodb+srv://node_shop:G15NJtyDC5S1FH6H@cluster0.8zekm.mongodb.net/Products?retryWrites=true&w=majority';

const mongoConnect = callback => {
	MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })
		.then(client => {
			console.log('Connected!!');
			_db = client.db();
			callback();
		})
		.catch(err => {
			console.log(err);
			throw err;
		});
};

const getDb = () => {
	if (_db) {
		return _db;
	}

	throw 'No database Found';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
