const { json } = require('body-parser');
const fs = require('fs');
const path = require('path');


const p = path.join(
	path.dirname(process.mainModule.filename),
	'data',
	'cart.json'
);

module.exports = class Cart {

	static addProduct(id, productPrice) {
		// Fetch the Previous cart
		fs.readFile(p, (err, fileContent) => {

			let cart = {
				products: [],
				totalPrice: 0
			};

			if (!err) {
				cart = JSON.parse(fileContent)
			}

			// Analyze the cart => Find the existing Product
			const existingProductIndex = cart.products.findIndex(product => product.id === id);
			const existingProduct = cart.products[existingProductIndex];

			let updatedProduct;

			if(existingProduct) {
				updatedProduct = { ...existingProduct };
				updatedProduct.quantity = updatedProduct.quantity +1;
				cart.products = [...cart.products];
				cart.products[existingProductIndex] = updatedProduct;
			}
			else {
				updatedProduct = {
					id: id,
					quantity: 1
				};
				cart.products = [...cart.products, updatedProduct];

			}

			// Add new product or Increse the quantity
			cart.totalPrice = cart.totalPrice + +productPrice;

			fs.writeFile(p, JSON.stringify(cart), (err) => {
				console.log(err);
			});
		});

	}

	static deleteProduct(id, productPrice) {
		fs.readFile(p, (err, fileContent) =>{

			if(err) {
				return;
			}

			const updatedCart = { ...JSON.parse(fileContent) };
			console.log({updatedCart});
			const product = updatedCart.products.find(prod => prod.id === id);

			if (!product) {
				return;
			}
			const productQty = product.quantity;

			updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);

			updatedCart.totalPrice = updatedCart.totalPrice - (productQty * productPrice);

			fs.writeFile(p, JSON.stringify(updatedCart), err => {
				console.log(err);
			});

		});
	}

	static getCart(cb) {
		fs.readFile(p, (err, fileContent) => {
			const cart = JSON.parse(fileContent);

			if(err) {
				cb(null);
			} else {
				cb(cart);
			}
		})
	}
}