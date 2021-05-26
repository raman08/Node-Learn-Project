const Order = require('../models/order');
const Product = require('../models/product');

exports.getProducts = (req, res) => {
	Product.find()
		.then(products => {
			res.render('shop/product-list', {
				title: 'All Products',
				products: products,
				path: '/products',
				// isAuthanticated: req.session.isLoggedIn,
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getProduct = (req, res) => {
	const productId = req.params.productId;
	console.log(productId);
	Product.findById(productId)
		.then(product => {
			res.render('shop/product-details', {
				title: product.title + ' | Product Details',
				product: product,
				// isAuthanticated: req.session.isLoggedIn,
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getIndex = (req, res) => {
	Product.find()
		.then(products => {
			res.render('shop/index', {
				title: 'Shop Home',
				products: products,
				path: '/',
				// isAuthanticated: req.session.isLoggedIn,
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getCart = (req, res) => {
	req.user
		.populate('cart.products.productId', 'title price')
		.execPopulate()
		.then(user => {
			return user.cart.products;
		})
		.then(products => {
			return res.render('shop/cart', {
				path: '/cart',
				title: 'Cart',
				products: products,
				// isAuthanticated: req.session.isLoggedIn,
			});
		});
};

exports.postCart = (req, res) => {
	const productId = req.body.productId;
	Product.findById(productId)
		.then(product => {
			return req.user.addToCart(product);
		})
		.then(result => {
			res.redirect('/cart');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postCartDeleteProduct = (req, res) => {
	const productId = req.body.productId;
	req.user
		.deleteCartItem(productId)
		.then(() => {
			res.redirect('/cart');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postOrder = (req, res) => {
	req.user
		.populate('cart.products.productId', 'title price')
		.execPopulate()
		.then(user => {
			return user.cart.products.map(product => {
				return {
					product: {
						productId: product.productId._id,
						title: product.productId.title,
						price: product.productId.price,
					},
					quantity: product.quantity,
				};
			});
		})
		.then(products => {
			let totalPrice = 0;
			products.forEach(product => {
				totalPrice =
					totalPrice +
					parseInt(product.product.price) * parseInt(product.quantity);
			});
			const orders = new Order({
				user: {
					userId: req.user._id,
					email: req.user.email,
				},
				products: products,
				orderValue: totalPrice,
			});
			return orders.save();
		})
		.then(() => {
			req.user.clearCart();
		})
		.then(() => {
			res.redirect('/orders');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getOrders = (req, res) => {
	Order.find({ 'user._id': req.user.userId })
		.then(orders => {
			res.render('shop/orders', {
				path: '/orders',
				title: 'Your Orders',
				orders: orders,
				// isAuthanticated: req.session.isLoggedIn,
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
		// isAuthanticated: req.session.isLoggedIn,
	});
};
