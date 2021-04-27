const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const { mongoConnect } = require('./utils/database');

// Creating the express app
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

// Setting up default body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	User.findById('6088443f53b3e8b3e0035017')
		.then(user => {
			req.user = new User(user.name, user.email, user.cart, user._id);
			next();
		})
		.catch(err => {
			console.log(err);
		});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Adding the 404 page
app.use(errorController.get404);

mongoConnect(() => {
	app.listen(3000, () => {
		console.log('Server started at http://localhost:3000');
	});
});
