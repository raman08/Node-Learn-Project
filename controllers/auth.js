const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: process.env.AUTH_EMAIL,
		pass: process.env.AUTH_PASSWORD,
	},
});

exports.getLogin = (req, res) => {
	let errorMessage = req.flash('error');
	errorMessage = errorMessage.length > 0 ? errorMessage[0] : undefined;

	let sucessMessage = req.flash('sucess');
	sucessMessage = sucessMessage.length > 0 ? sucessMessage[0] : undefined;

	res.render('auth/login', {
		path: '/login',
		title: 'Login',
		errorMessage: errorMessage,
		sucessMessage: sucessMessage,
	});
};

exports.getSignup = (req, res) => {
	let errorMessage = req.flash('error');
	errorMessage = errorMessage.length > 0 ? errorMessage[0] : undefined;
	res.render('auth/signup', {
		path: '/signup',
		title: 'Sign Up',
		errorMessage: errorMessage,
	});
};

exports.postLogin = (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email: email })
		.then(user => {
			if (!user) {
				req.flash('error', 'Invalid Email or Password');
				return res.redirect('/login');
			}
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
					req.flash('error', 'Invalid Email or Password');
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
				req.flash('error', 'Email already exist!!');
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
					req.flash('sucess', 'Account Created Sucessfully!!');
					res.redirect('/login');

					const mailOptions = {
						from: 'nodeshopdevil08@gmail.com',
						to: email,
						subject: 'Sign Up sucessfully',
						html: '<h1>Sign Up sucessfully!!!</h1>',
					};

					return transporter.sendMail(mailOptions);
				})
				.then(() => {
					console.log('Mail send sucessfully');
				})
				.catch(err => {
					console.log(err);
				});
		})
		.catch(err => console.log(err));
};

exports.postLogout = (req, res) => {
	req.session.destroy(err => {
		console.log(err);
		res.redirect('/login');
	});
};
