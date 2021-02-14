const express = require('express');

const bodyParser = require('body-parser');

// Creating the express app
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes= require('./routes/shop');

// Setting up default body parser
app.use(bodyParser.urlencoded({extended: false}));

app.use(adminRoutes);
app.use(shopRoutes);

// Adding the 404 page
app.use((req, res, next) => {
	res.status(404)
	   .send('<h1>404-Page Not Found</h1>')
});

app.listen(3000);