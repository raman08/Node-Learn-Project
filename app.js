const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const errorController = require('./controllers/error');

const MONGODB_URI =
	'mongodb+srv://node_shop:G15NJtyDC5S1FH6H@cluster0.8zekm.mongodb.net/Shop';

// Creating the express app
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(
	session({
		secret: 'I love batman',
		resave: true,
		saveUninitialized: true,
		store: MongoStore.create({ mongoUrl: MONGODB_URI }),
		autoRemove: 'native',
		unset: 'destroy',
	})
);

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const User = require('./models/user');

// Setting up default body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then(user => {
			req.user = user;
			next();
		})
		.catch(err => {
			console.log(err);
		});
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// Adding the 404 page
app.use(errorController.get404);

mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		User.findOne().then(user => {
			if (!user) {
				const user = new User({
					name: 'Raman',
					email: 'test@123.com',
					cart: { products: [] },
				});
				user.save();
			}
		});
		app.listen(3000, () => {
			console.log('Server started at http://localhost:3000');
		});
	})
	.catch(err => {
		console.log(err);
	});
