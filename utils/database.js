const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;
const url = 'mongodb+srv://node_user:J0sdQ8pXtyzYW7i3@cluster0.8zekm.mongodb.net/shop?retryWrites=true&w=majority';

const mongoConnect = (callback) => {
	MongoClient.connect(url, { useUnifiedTopology: true })
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
	if(_db) {
		return _db;
	}

	throw 'No database Found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;