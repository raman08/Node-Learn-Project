const Product = require('../models/product');

exports.getProducts = (req, res, next) => {

	Product.fetchAll((products) => {
		res.render('shop/product-list', {
			title: 'All Products',
			products: products,
			path: '/products'
		});
	});
};

exports.getProduct = (req, res, next) => {
	const productId = req.params.productId;
	Product.findById(productId, product => {
		console.log(product);
		res.render('shop/product-details', {
			title: 'Product Details',
			product: product
		});
	});
};

exports.getIndex =  (req, res, next) => {
	Product.fetchAll((products) => {
		res.render('shop/index', {
			title: 'Shop Home',
			products: products,
			path: '/'
		})
	});
}

exports.getCart = (req, res, next) => {
	res.render('shop/cart' ,{
		path: '/cart',
		title: 'Cart'
	});
}

exports.getOrders = (req, res, next) => {
	res.render('shop/orders' ,{
		path: '/orders',
		title: 'Your Orders'
	});
}

exports.getCheckout = (req, res, next) => {
	res.render('/shop/checkout', {
		title: 'Checkout',
		path: '/checkout'
	})
}