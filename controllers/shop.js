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
			console.log(product);
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
	req.user
		.getCart()
		.then(cart => {
			return cart
				.getProducts()
				.then(products => {
					res.render('shop/cart', {
						path: '/cart',
						title: 'Cart',
						products: products,
					});
				})
				.catch(err => {
					console.log(err);
				});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postCart = (req, res) => {
	const productId = req.body.productId;
	let fetchedCart;
	let newQuantity = 1;

	req.user
		.getCart()
		.then(cart => {
			fetchedCart = cart;
			return cart.getProducts({ where: { id: productId } });
		})
		.then(products => {
			let product;
			if (products.length > 0) {
				product = products[0];
			}

			if (product) {
				const oldQuantity = product.cartItem.quantity;
				newQuantity = oldQuantity + 1;
				return product;
			}

			return Product.findByPk(productId);
		})
		.then(product => {
			return fetchedCart.addProduct(product, {
				through: { quantity: newQuantity },
			});
		})
		.then(() => {
			res.redirect('/cart');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postCartDeleteProduct = (req, res) => {
	const productId = req.body.productId;
	req.user
		.getCart()
		.then(cart => {
			return cart.getProducts({ where: { id: productId } });
		})
		.then(products => {
			const product = products[0];
			product.cartItem.destroy();
		})
		.then(() => {
			console.log('Product Deleted Sucessfully!!!');

			res.redirect('/cart');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postOrder = (req, res) => {
	let fetchedCart;
	req.user
		.getCart()
		.then(cart => {
			fetchedCart = cart;
			return cart.getProducts();
		})
		.then(products => {
			return req.user
				.createOrder()
				.then(order => {
					order.addProducts(
						products.map(product => {
							product.orderItem = { quantity: product.cartItem.quantity };
							return product;
						})
					);
				})
				.catch(err => {
					console.log(err);
				});
		})
		.then(() => {
			return fetchedCart.setProducts(null);
		})
		.then(() => {
			res.redirect('/orders');
		})
		.catch(err => {
			console.log(err);
		});
};

exports.getOrders = (req, res) => {
	req.user
		.getOrders({ include: ['products'] })
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
