const fs = require('fs');
const path = require('path');

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

	constructor(title, imageUrl, description, price) {
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
		this.id = Math.random().toString();
		getProductFromFile(products => {
			products.push(this);
			fs.writeFile(p, JSON.stringify(products), (err) => {
				console.log(err);
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