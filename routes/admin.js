const path = require('path');

const express = require('express');


const rootDir = require('../utils/path');

const router = express.Router();

const products = [];

router.get('/add-product',(req, res, next) => {
	// Sending the responce
	res.render('add-product', {title: 'Add Product', path: '/admin/add-product'})

});

router.post('/add-product', (req, res, next) => {
	products.push({ title: req.body.title });
	res.redirect('/');
});

exports.routes = router;
exports.products = products;