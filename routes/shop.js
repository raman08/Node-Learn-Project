const express = require('express');

const router = express.Router();


router.get('/',(req, res, next) => {
	// Sending the responce
	res.send('<h1>Hello From Express</h1>');

});
module.exports = router