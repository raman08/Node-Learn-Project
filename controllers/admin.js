const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/add-product', {
		title: 'Add Product',
		path: '/admin/add-product'
	})
}

exports.postAddProduct = (req, res, next) => {
	const {title, imageUrl, price, desctiption } = req.body;

	console.log({title, imageUrl, price, desctiption });

	const product = new Product(title, imageUrl, desctiption, price);
	product.save();

	res.redirect('/products')
}

exports.getProduct = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render('admin/products', {
			title: 'Shop Home',
			products: products,
			path: '/admin/products'
		})
	});
}