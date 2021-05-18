const User = require('../models/user');

exports.getLogin = (req, res) => {
	console.log(req.session);
	res.render('auth/login', {
		path: '/login',
		title: 'Login',
		isAuthanticated: req.session.isLoggedIn,
	});
};

exports.postLogin = (req, res) => {
	User.findById('608ae31792bc2a9469eb5242')
		.then(user => {
			req.session.isLoggedIn = true;
			req.session.user = user;
			req.session.save(err => {
				console.log(err);
				res.redirect('/');
			});
		})
		.catch(err => {
			console.log(err);
		});
};

exports.postLogout = (req, res) => {
	req.session.destroy(err => {
		console.log(err);
		res.redirect('/');
	});
};
