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

// Setting up default body parser
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
// 	User.findByPk(1)
// 		.then(user => {
// 			req.user = user;
// 			next();
// 		})
// 		.catch(err => {
// 			console.log(err);
// 		});
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Adding the 404 page
app.use(errorController.get404);

mongoConnect(() => {
	app.listen(3001, () => {
		console.log('Server started at http://localhost:3001');
	});
});
