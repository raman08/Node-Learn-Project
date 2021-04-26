const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
	res.render('admin/edit-product', {
		title: 'Add Product',
		path: '/admin/add-product',
	});
};

exports.postAddProduct = (req, res) => {
	const { title, imageUrl, price, description } = req.body;

	const product = new Product(title, price, description, imageUrl);
	product
		.save()
		.then(() => {
			// console.log(result);
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
			console.log('getProduct');
			console.log(product);
			if (!product) {
				console.log('Product Not found');
				return res.redirect('/');
			}
			res.render('admin/edit-product', {
				title: 'Add Product',
				path: '/admin/edit-product',
				editing: editMode,
				product: product,
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postEditProduct = (req, res) => {
	const { productId, title, imageUrl, price, description } = req.body;

	const product = new Product(title, price, description, imageUrl, productId);

	product
		.save()
		.then(() => {
			console.log('Product Updated Sucessfully');
			res.redirect('/admin/products');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getProduct = (req, res) => {
	// Product.findAll()
	Product.fetchAll()
		.then(products => {
			res.render('admin/products', {
				title: 'Shop Home',
				products: products,
				path: '/admin/products',
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postDeleteProduct = (req, res) => {
	const productId = req.body.productId;
	Product.deleteByID(productId)
		.then(() => {
			console.log('Product Deleted Sucessfully');
			res.redirect('/admin/products');
		})
		.catch(err => {
			console.log(err);
		});
};
