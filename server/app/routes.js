var Q = require('q');
var jsonfile = require('jsonfile');
var genre = require('./genre');

module.exports = function(app, api) {
	function loggedIn(req, res, next) {
		if (req.user) {
			next();
		} else {
			res.redirect('/login');
		}
	}

	app.get('/login', function(req, res){
		res.render('login');
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	app.get('/', loggedIn, function(req, res) {
		genre.testFeatures(api);

		res.render('home', {
			user: req.user.id,
		});
	});

	app.get('*', loggedIn, function(req, res) {
		res.redirect('/error');
	});
}
