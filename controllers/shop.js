const Product = require('../models/product');

exports.getProducts = (req, res) => {
	Product.fetchAll()
		.then(products => {
			res.render('shop/product-list', {
				title: 'All Products',
				products: products,
				path: '/products',
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getProduct = (req, res) => {
	const productId = req.params.productId;
	Product.findById(productId)
		.then(product => {
			res.render('shop/product-details', {
				title: product.title + ' | Product Details',
				product: product,
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getIndex = (req, res) => {
	Product.fetchAll()
		.then(products => {
			res.render('shop/index', {
				title: 'Shop Home',
				products: products,
				path: '/',
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getCart = (req, res) => {
	req.user.getCart().then(products => {
		res.render('shop/cart', {
			path: '/cart',
			title: 'Cart',
			products: products,
		});
	});
};

exports.postCart = (req, res) => {
	const productId = req.body.productId;
	console.log(productId);
	Product.findById(productId)
		.then(product => {
			return req.user.addToCart(product);
		})
		.then(result => {
			console.log(result);
			res.redirect('/cart');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postCartDeleteProduct = (req, res) => {
	const productId = req.body.productId;
	req.user
		.deleteCartItems(productId)
		.then(() => {
			console.log('Product Deleted Sucessfully!!!');

			res.redirect('/cart');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postOrder = (req, res) => {
	req.user
		.addOrder()
		.then(() => {
			res.redirect('/orders');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getOrders = (req, res) => {
	req.user
		.getOrders()
		.then(orders => {
			res.render('shop/orders', {
				path: '/orders',
				title: 'Your Orders',
				orders: orders,
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getCheckout = (req, res) => {
	res.render('/shop/checkout', {
		title: 'Checkout',
		path: '/checkout',
	});
};
