const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error')
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const order = require('./models/order');
const orderItem = require('./models/order-item');


// Creating the express app
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');


const adminRoutes = require('./routes/admin');
const shopRoutes= require('./routes/shop');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

// Setting up default body parser
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
	User.findByPk(1)
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

// Adding the 404 page
app.use(errorController.get404);

// Adding the assoications to the models
Product.belongsTo(User, {
	constraints: true,
	onDelete: 'CASCADE'
});
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem});
Product.belongsToMany(Cart, { through: CartItem});

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });

// Syncing the database
sequelize
	// .sync({ force: true })
	.sync()
	.then(result => {
		return User.findByPk(1);
	})
	.then(user => {
		if(!user){
			return User.create({name: 'TestUser', email: 'testUser@test.com'});
		}
		return user;
	})
	.then(user => {
		return user.createCart();
	})
	.then(cart => {
		// Starting the app
		app.listen(3000, () => {
			console.log('Server started at http://localhost:3000');
		});
	})
	.catch(err => {
		console.log(err);
	});

