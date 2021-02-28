const Product = require('../models/product');
const Cart = require('../models/cart');

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
		});
	});
};

exports.getCart = (req, res, next) => {
	Cart.getCart(cart => {

		Product.fetchAll(products => {
			const cartProducts = [];

			for(product of products) {
				const cartProductData = cart.products.find(prod => prod.id === product.id);
				if(cartProductData) {
					cartProducts.push({productData: product, quantity: cartProductData.quantity});
				}
			}

			res.render('shop/cart' ,{
				path: '/cart',
				title: 'Cart',
				products : cartProducts
			});
		})

	});


};

exports.postCart = (req, res, next) => {
	const productId = req.body.productId;
	Product.findById(productId, (product) => {
		Cart.addProduct(productId, product.price);
	});
	res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
	const productId = req.body.productId;
	Product.findById(productId, product=> {
		Cart.deleteProduct(productId, product.price);
	})

	res.redirect('/cart');
}

exports.getOrders = (req, res, next) => {
	res.render('shop/orders' ,{
		path: '/orders',
		title: 'Your Orders'
	});
};

exports.getCheckout = (req, res, next) => {
	res.render('/shop/checkout', {
		title: 'Checkout',
		path: '/checkout'
	});
};