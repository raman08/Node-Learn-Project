const fs = require('fs');
const path = require('path');
const { deleteProduct } = require('./cart');

const Cart = require('./cart');

const p = path.join(
	path.dirname(process.mainModule.filename),
	'data',
	'products.json'
);

const getProductFromFile = cb => {

	fs.readFile(p, (err, fileContent) => {

		if(err) {
			return cb([]);
		}

		let products;

		try {
			products = JSON.parse(fileContent);

		} catch (error) {
			console.error(error);
			products = [];
		}

		cb(products);
	});
}

module.exports = class Product {

	constructor(id, title, imageUrl, description, price) {
		this.id = id;
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {

		getProductFromFile(products => {
			if(this.id) {
				const existingProductIndex = products.findIndex(product => product.id === this.id);

				const updatedProducts = [...products];
				updatedProducts[existingProductIndex] = this;
				fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
				console.log(err);
			})
			}
			else {
				this.id = Math.random().toString();
				products.push(this);
				fs.writeFile(p, JSON.stringify(products), (err) => {
					console.log(err);
				});
			}
		});
	}

	static deleteById(id) {
		getProductFromFile(products => {

			const product = products.find(prod => prod.id === id);

			const updatedProducts = products.filter(pro => pro.id !== id);

			fs.writeFile(p, JSON.stringify(updatedProducts), err => {
				if(!err){
					Cart.deleteProduct(id, product.price);
				}
			})
		});
	}

	static fetchAll(cb) {
		getProductFromFile(cb);
	}

	static findById(id, cb) {
		getProductFromFile(products => {
			const product = products.find(pro => pro.id == id);
			cb(product);
		});
	}
}