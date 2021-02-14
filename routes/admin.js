const express = require('express');

const router = express.Router();

router.get('/add-product',(req, res, next) => {
	// Sending the responce
	res.send('<form action="/product" method="POST"><input type="text" name="Product"><button type="submit">Submit Product</button></form>');

});

router.post('/product', (req, res, next) => {
	console.log(req.body);
	res.redirect('/');
});

module.exports = router;