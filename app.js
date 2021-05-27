const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
// const csrf = require('csurf');
const flash = require('connect-flash');

require('dotenv').config();

const errorController = require('./controllers/error');

const MONGODB_URI = process.env.MONGODB_URI;

// Creating the express app
const app = express();
// const csrfProtection = csrf();

app.set('view engine', 'pug');
app.set('views', './views');

// app.use(cookieParser);

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

// app.use(csrfProtection);
app.use(flash());

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
			if (!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch(err => {
			throw new Error(err);
		});
});

app.use((req, res, next) => {
	res.locals.isAuthanticated = req.session.isLoggedIn;
	// res.locals.csrfToken = req.csrfToken();
	next();
});

// Adding Custom Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorController.get500);
// Adding the 404 page
app.use(errorController.get404);

app.use((error, req, res, next) => {
	res.redirect('/500');
});

mongoose
	.connect(MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		app.listen(process.env.PORT || 3000, () => {
			console.log(`Server started at http://localhost:3000`);
		});
	})
	.catch(err => {
		console.log(err);
	});
