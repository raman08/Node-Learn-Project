const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
	res.render('admin/edit-product', {
		title: 'Add Product',
		path: '/admin/add-product'
	})
}

exports.postAddProduct = (req, res, next) => {
	const {title, imageUrl, price, description } = req.body;

	const product = new Product(title, price, description, imageUrl);
	product.save()
		.then(result => {
			// console.log(result);
			console.log('Product created Sucessfully!!');
			res.redirect('/admin/products');
		})
		.catch(err => {
			console.log(err);
		});

}

// exports.getEditProduct = (req, res, next) => {
// 	const editMode = req.query.edit;

// 	if(!editMode) {
// 		return res.redirect('/');
// 	}

// 	const productId = req.params.productId;
// 	req.user.getProducts({ where: { id: productId } })
// 	// Product.findByPk(productId)
// 		.then(products => {
// 			const product = products[0];
// 			if (!product) {
// 				console.log('Product Not found');
// 				return res.redirect('/');
// 			}
// 			res.render('admin/edit-product', {
// 				title: 'Add Product',
// 				path: '/admin/edit-product',
// 				editing: editMode,
// 				product: product
// 			});
// 		})
// 		.catch(err => {
// 			console.log(err);
// 		});
// };

// exports.postEditProduct = (req, res, next) => {
// 	const {productId, title, imageUrl, price, description } = req.body;

// 	Product.findByPk(productId)
// 		.then(product => {
// 			product.title = title;
// 			product.imageUrl = imageUrl;
// 			product.price = price;
// 			product.description = description;

// 			return product.save();
// 		})
// 		.then(result => {
// 			console.log(result);
// 			res.redirect('/admin/products');
// 		})
// 		.catch(err => {
// 			console.log(err);
// 		});

// };

// exports.getProduct = (req, res, next) => {
// 	// Product.findAll()
// 	req.user.getProducts()
// 		.then(products => {
// 			res.render('admin/products', {
// 				title: 'Shop Home',
// 				products: products,
// 				path: '/admin/products'
// 			})
// 		})
// 		.catch(err => {
// 			console.log(err);
// 		});
// }

// exports.postDeleteProduct = (req, res, next) => {
// 	const productId = req.body.productId;
// 	// Product.findByPk(productId)
// 	req.user.getProducts()
// 		.then(product => {
// 			product.destroy();
// 		})
// 		.then(result => {
// 			console.log('Product Deleted Sucessfully');
// 			res.redirect('/admin/products');
// 		})
// 		.catch(err => {
// 			console.log(err);
// 		})
// }