const { validationResult } = require('express-validator');
const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
	res.render('admin/edit-product', {
		title: 'Add Product',
		path: '/admin/add-product',
		errorMessage: '',
		validationErrors: [],
		hasErrors: false,
	});
};

exports.postAddProduct = (req, res, next) => {
	const validationErrors = validationResult(req);
	const { title, price, description } = req.body;
	const image = req.file;

	if (!image) {
		return res.status(422).render('admin/edit-product', {
			title: 'Add Product',
			path: '/admin/add-product',
			errorMessage: 'The file type is not supported',
			validationErrors: [],
			hasErrors: true,
			product: {
				title: title,
				price: price,
				description: description,
			},
		});
	}
	if (!validationErrors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			title: 'Add Product',
			path: '/admin/add-product',
			errorMessage: validationErrors.array()[0].msg,
			validationErrors: validationErrors.array(),
			hasErrors: true,
			product: {
				title: title,
				price: price,
				description: description,
			},
		});
	}

	const imageUrl = '/' + image.path;
	const product = new Product({
		title: title,
		price: price,
		description: description,
		imageUrl: imageUrl,
		userId: req.user._id,
	});

	product
		.save()
		.then(() => {
			console.log('Product created Sucessfully!!');
			res.redirect('/admin/products');
		})
		.catch(err => {
			const error = new Error(err);
			error.statusCode = 500;
			return next(error);
		});
};

exports.getEditProduct = (req, res, next) => {
	const editMode = req.query.edit;

	if (!editMode) {
		return res.redirect('/');
	}

	const productId = req.params.productId;
	Product.findById(productId)
		.then(product => {
			if (!product) {
				console.log('Product Not found');
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				title: 'Add Product',
				path: '/admin/edit-product',
				editing: editMode,
				product: product,
				hasErrors: false,
				validationErrors: [],
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.statusCode = 500;
			return next(error);
		});
};

exports.postEditProduct = (req, res, next) => {
	const { productId, title, price, description } = req.body;
	const image = req.file;
	const validationErrors = validationResult(req);

	if (!validationErrors.isEmpty()) {
		return res.status(422).render('admin/edit-product', {
			title: 'Edit Product',
			path: '/admin/edit-product',
			errorMessage: validationErrors.array()[0].msg,
			validationErrors: validationErrors.array(),
			editing: true,
			hasErrors: true,
			product: {
				title: title,
				price: price,
				description: description,
				_id: productId,
			},
		});
	}
	const updatedProduct = {
		title: title,
		description: description,
		price: price,
	};

	if (image) {
		updatedProduct.imageUrl = '/' + image.path;
	}

	console.log(updatedProduct);

	Product.findOneAndUpdate(
		{ _id: productId, userId: req.user._id },
		updatedProduct,
		{ new: true }
	)
		.then(() => {
			console.log('Product Updated Sucessfully');
			res.redirect('/admin/products');
		})
		.catch(err => {
			const error = new Error(err);
			error.statusCode = 500;
			return next(error);
		});
};

exports.getProduct = (req, res, next) => {
	Product.find({ userId: req.user._id })
		.then(products => {
			res.render('admin/products', {
				title: 'Shop Home',
				products: products,
				path: '/admin/products',
				// isAuthanticated: req.session.isLoggedIn,
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.statusCode = 500;
			return next(error);
		});
};

exports.postDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	Product.findOneAndRemove({ _id: productId, userId: req.user._id })
		.then(() => {
			console.log('Product Deleted Sucessfully');
			res.redirect('/admin/products');
		})
		.catch(err => {
			const error = new Error(err);
			error.statusCode = 500;
			return next(error);
		});
};
