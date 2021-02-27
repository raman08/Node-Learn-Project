const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		title: 'Add Product',
		path: '/admin/add-product'
	})
}

exports.postAddProduct = (req, res, next) => {
	const {title, imageUrl, price, desctiption } = req.body;

	const product = new Product(null, title, imageUrl, desctiption, price);
	product.save();

	res.redirect('/products');
}

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;

	if(!editMode) {
		return res.redirect('/');
	}

	const productId = req.params.productId;

	Product.findById(productId, product => {
			if (!product) {
				console.log('Product Not found');
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
			title: 'Add Product',
			path: '/admin/edit-product',
			editing: editMode,
			product: product
		});
	});
};

exports.postEditProduct = (req, res, next) => {
	const {productId, title, imageUrl, price, desctiption } = req.body;

	const product = new Product(productId, title, imageUrl, desctiption, price);
	product.save();

	res.redirect('/admin/products')
};

exports.getProduct = (req, res, next) => {
	Product.fetchAll((products) => {
		res.render('admin/products', {
			title: 'Shop Home',
			products: products,
			path: '/admin/products'
		})
	});
}