const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error')
const db = require('./utils/database');

// Creating the express app
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');


const adminRoutes = require('./routes/admin');
const shopRoutes= require('./routes/shop');

db.execute('SELECT * FROM products')
	.then(result => {
		console.log(result[0],'\n',result[1]);
	})
	.catch(err => {
	console.log(err);
});


// Setting up default body parser
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Adding the 404 page
app.use(errorController.get404);

app.listen(3000, () => {
	console.log('Server started at http://localhost:3000');
});