const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');

// Creating the express app
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');


const adminData = require('./routes/admin');
const shopRoutes= require('./routes/shop');

// Setting up default body parser
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

// Adding the 404 page
app.use((req, res, next) => {
	res.status(404)
	   .render('404', { title: '404 - Page Not found'});
});

app.listen(3000);