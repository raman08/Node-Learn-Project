const mongoose = require('mongoose');

const user = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	cart: {
		products: [
			{
				productId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Product',
					required: true,
				},
				quantity: { type: Number, required: true },
			},
		],
	},
});

user.methods.addToCart = function (product) {
	let cartProductIndex;

	try {
		cartProductIndex = this.cart.products.findIndex(cp => {
			return cp.productId.toString() === product._id.toString();
		});
	} catch (error) {
		cartProductIndex = -1;
	}

	let newQuantity = 1;
	const updatedCartItems = [...this.cart.products];

	if (cartProductIndex >= 0) {
		newQuantity = this.cart.products[cartProductIndex].quantity + 1;
		updatedCartItems[cartProductIndex].quantity = newQuantity;
	} else {
		updatedCartItems.push({
			productId: product._id,
			quantity: newQuantity,
		});
	}

	const updatedCart = {
		products: updatedCartItems,
	};

	this.cart = updatedCart;
	return this.save();
};

// user.methods.getCart = function () {
// 	return this.populate('cart.products.productId', 'title price')
// 		.execPopulate()
// 		.then(user => {
// 			return user.cart.products;
// 		})
// 		.then(result => {
// 			console.log(result);
// 			return result;
// 		});
// };

user.methods.deleteCartItem = function (productId) {
	const updatedCartProducts = this.cart.products.filter(item => {
		return item.productId.toString() !== productId.toString();
	});

	this.cart.products = updatedCartProducts;
	return this.save();
};

user.methods.clearCart = function () {
	this.cart = { products: [] };
	return this.save();
};

module.exports = mongoose.model('User', user);

// const mongodb = require('mongodb');
// const { getDb } = require('../utils/database');

// class User {
// 	constructor(userName, email, cart, id) {
// 		this.name = userName;
// 		this.email = email;
// 		this.cart = cart;
// 		this._id = id;
// 	}

// 	save() {
// 		const db = getDb();

// 		return db
// 			.collection('user')
// 			.insertOne(this)
// 			.then(() => {
// 				console.log('User Saved Sucessfully');
// 			})
// 			.catch(err => {
// 				console.log(err);
// 			});
// 	}

// 	addToCart(product) {
// 		let cartProductIndex;
// 		console.log(product);
// 		try {
// 			cartProductIndex = this.cart.items.findIndex(cp => {
// 				return cp.productId.toString() === product._id.toString();
// 			});
// 		} catch (error) {
// 			cartProductIndex = -1;
// 		}

// 		let newQuantity = 1;
// 		const updatedCartItems = [...this.cart.items];

// 		if (cartProductIndex >= 0) {
// 			newQuantity = this.cart.items[cartProductIndex].quantity + 1;
// 			updatedCartItems[cartProductIndex].quantity = newQuantity;
// 		} else {
// 			updatedCartItems.push({
// 				productId: new mongodb.ObjectID(product._id),
// 				quantity: newQuantity,
// 			});
// 		}

// 		const updatedCart = {
// 			items: updatedCartItems,
// 		};
// 		const db = getDb();
// 		return db
// 			.collection('users')
// 			.updateOne(
// 				{ _id: new mongodb.ObjectID(this._id) },
// 				{ $set: { cart: updatedCart } }
// 			);
// 	}

// 	getCart() {
// 		const db = getDb();
// 		const productsId = this.cart.items.map(item => {
// 			return item.productId;
// 		});
// 		const products = db
// 			.collection('products')
// 			.find({ _id: { $in: productsId } })
// 			.toArray()
// 			.then(products => {
// 				return products.map(product => {
// 					console.log('Get Cart product');
// 					console.log(product);
// 					return {
// 						...product,
// 						quantity: this.cart.items.find(item => {
// 							return item.productId.toString() === product._id.toString();
// 						}).quantity,
// 					};
// 				});
// 			});
// 		return products;
// 	}

// 	deleteCartItems(productId) {
// 		const updatedCartItems = this.cart.items.filter(item => {
// 			return item.productId.toString() !== productId.toString();
// 		});

// 		const db = getDb();
// 		return db
// 			.collection('users')
// 			.updateOne(
// 				{ _id: new mongodb.ObjectID(this._id) },
// 				{ $set: { cart: { items: updatedCartItems } } }
// 			);
// 	}

// 	addOrder() {
// 		const db = getDb();
// 		return this.getCart()
// 			.then(products => {
// 				const newOrder = { items: products, user: { _id: this._id } };
// 				return db.collection('orders').insertOne(newOrder);
// 			})
// 			.then(result => {
// 				console.log(result);
// 				this.cart.items = [];
// 				return db
// 					.collection('users')
// 					.updateOne(
// 						{ _id: new mongodb.ObjectID(this._id) },
// 						{ $set: { cart: { items: [] } } }
// 					);
// 			});
// 	}

// 	getOrders() {
// 		const db = getDb();
// 		return db
// 			.collection('orders')
// 			.find({ 'user._id': mongodb.ObjectID(this._id) })
// 			.toArray();
// 	}

// 	static findById(userId) {
// 		const db = getDb();

// 		return db
// 			.collection('users')
// 			.findOne({ _id: mongodb.ObjectID(userId) })
// 			.then(user => {
// 				return user;
// 			})
// 			.catch(err => {
// 				console.log(err);
// 			});
// 	}
// }

// module.exports = User;
