const Order = require('../models/order');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
	Product.find()
		.then(products => {
			res.render('shop/product-list', {
				title: 'All Products',
				products: products,
				path: '/products',
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.statusCode = 500;
			return next(error);
		});
};

exports.getProduct = (req, res, next) => {
	const productId = req.params.productId;
	Product.findById(productId)
		.then(product => {
			res.render('shop/product-details', {
				title: product.title + ' | Product Details',
				product: product,
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.statusCode = 500;
			return next(error);
		});
};

exports.getIndex = (req, res, next) => {
	Product.find()
		.then(products => {
			res.render('shop/index', {
				title: 'Shop Home',
				products: products,
				path: '/',
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.statusCode = 500;
			return next(error);
		});
};

exports.getCart = (req, res, next) => {
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
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.statusCode = 500;
			return next(error);
		});
};

exports.postCart = (req, res, next) => {
	const productId = req.body.productId;
	Product.findById(productId)
		.then(product => {
			return req.user.addToCart(product);
		})
		.then(() => {
			res.redirect('/cart');
		})
		.catch(err => {
			const error = new Error(err);
			error.statusCode = 500;
			return next(error);
		});
};

exports.postCartDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	req.user
		.deleteCartItem(productId)
		.then(() => {
			res.redirect('/cart');
		})
		.catch(err => {
			const error = new Error(err);
			error.statusCode = 500;
			return next(error);
		});
};

exports.postOrder = (req, res, next) => {
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
			const error = new Error(err);
			error.statusCode = 500;
			return next(error);
		});
};

exports.getOrders = (req, res, next) => {
	Order.find({ 'user._id': req.user.userId })
		.then(orders => {
			res.render('shop/orders', {
				path: '/orders',
				title: 'Your Orders',
				orders: orders,
			});
		})
		.catch(err => {
			const error = new Error(err);
			error.statusCode = 500;
			return next(error);
		});
};

exports.getCheckout = (req, res) => {
	res.render('/shop/checkout', {
		title: 'Checkout',
		path: '/checkout',
	});
};
