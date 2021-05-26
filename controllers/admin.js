const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
	res.render('admin/edit-product', {
		title: 'Add Product',
		path: '/admin/add-product',
		// isAuthanticated: req.session.isLoggedIn,
	});
};

exports.postAddProduct = (req, res) => {
	const { title, imageUrl, price, description } = req.body;

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
			console.log(err);
		});
};

exports.getEditProduct = (req, res) => {
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
				// isAuthanticated: req.session.isLoggedIn,
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postEditProduct = (req, res) => {
	const { productId, title, imageUrl, price, description } = req.body;

	Product.findOneAndUpdate(
		{ _id: productId, userId: req.user._id },
		{
			title: title,
			imageUrl: imageUrl,
			description: description,
			price: price,
		},
		{ new: true }
	)
		.then(() => {
			console.log('Product Updated Sucessfully');
			res.redirect('/admin/products');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getProduct = (req, res) => {
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
			console.log(err);
		});
};

exports.postDeleteProduct = (req, res) => {
	const productId = req.body.productId;
	Product.findOneAndRemove({ _id: productId, userId: req.user._id })
		.then(() => {
			console.log('Product Deleted Sucessfully');
			res.redirect('/admin/products');
		})
		.catch(err => {
			console.log(err);
		});
};
