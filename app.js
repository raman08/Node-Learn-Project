const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error')
const sequelize = require('./utils/database');

// Creating the express app
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');


const adminRoutes = require('./routes/admin');
const shopRoutes= require('./routes/shop');

// Setting up default body parser
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Adding the 404 page
app.use(errorController.get404);

sequelize.sync()
	.then(result => {
		// Starting the app
		app.listen(3000, () => {
			console.log('Server started at http://localhost:3000');
		})
	})
	.catch(err => {
		console.log(err);
	});

