const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
	res.render('auth/login', {
		path: '/login',
		title: 'Login',
		isAuthanticated: req.session.isLoggedIn,
	});
};

exports.getSignup = (req, res) => {
	res.render('auth/signup', {
		path: '/signup',
		title: 'Sign Up',
		isAuthanticated: req.session.isLoggedIn,
	});
};

exports.postLogin = (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email: email })
		.then(user => {
			bcrypt
				.compare(password, user.password)
				.then(doMatch => {
					if (doMatch) {
						req.session.isLoggedIn = true;
						req.session.user = user;
						return req.session.save(err => {
							console.log(err);
							res.redirect('/');
						});
					}
					res.redirect('/login');
				})
				.catch(err => {
					console.log(err);
				});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postSighup = (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const confirmPassword = req.body.confirmPassword;

	User.findOne({ email: email })
		.then(user => {
			if (user) {
				return res.redirect('/signup');
			}

			return bcrypt
				.hash(password, 12)
				.then(hashPassword => {
					const newUser = new User({
						email: email,
						password: hashPassword,
						cart: { items: [] },
					});

					return newUser.save();
				})
				.then(() => {
					res.redirect('/login');
				});
		})
		.catch(err => console.log(err));
};

exports.postLogout = (req, res) => {
	req.session.destroy(err => {
		console.log(err);
		res.redirect('/');
	});
};
