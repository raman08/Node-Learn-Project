const mongodb = require('mongodb');
const { getDb } = require('../utils/database');

class Product {
	constructor(title, price, description, imageUrl, id, userId) {
		this.title = title;
		this.price = price;
		this.description = description;
		this.imageUrl = imageUrl;
		this._id = id;
		this.userId = userId;
	}

	save() {
		const db = getDb();
		let dbOp;
		if (this._id) {
			// Update product
			dbOp = db.collection('products').updateOne(
				{ _id: mongodb.ObjectId(this._id) },
				{
					$set: {
						title: this.title,
						price: this.price,
						description: this.description,
						imageUrl: this.imageUrl,
					},
				}
			);
		} else {
			dbOp = db.collection('products').insertOne(this);
		}
		return dbOp
			.then(() => {
				console.log('Updating/Saving  product');
			})
			.catch(err => console.log(err));
	}

	static fetchAll() {
		const db = getDb();
		return db
			.collection('products')
			.find()
			.toArray()
			.then(products => {
				console.log('Fetching All the products');
				console.log(products);
				return products;
			})
			.catch(err => {
				console.log(err);
			});
	}

	static findById(productId) {
		const db = getDb();
		return db
			.collection('products')
			.find({ _id: new mongodb.ObjectID(productId) })
			.next()
			.then(product => {
				console.log(product);
				return product;
			})
			.catch(err => {
				console.log(err);
			});
	}

	static deleteByID(productId) {
		const db = getDb();
		return db
			.collection('products')
			.deleteOne({ _id: new mongodb.ObjectID(productId) })
			.then(() => {
				console.log('Deleted Product');
			})
			.catch(err => {
				console.log(err);
			});
	}
}

module.exports = Product;
