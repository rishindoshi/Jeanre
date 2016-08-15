var Q = require('q');
var jsonfile = require('jsonfile');
var classifier = require('./genre');

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
		var genres = ["Party", "Indie", "Hip Hop"];

		for (var i = 0; i < genres.length; ++i) {
			classifier.getFeatures(genres[i], api)
				.then(function(featureArray){
					var path = "/Users/rishindoshi/Documents/College/Projects/Jeanre/classification/training_data/";
					classifier.writeFeatureToFile(path, genres[i], featureArray);
				})
				.catch(function(err){
					console.log(err);
				});
		}

		res.render('home', {
			user: req.user.id,
		});
	});

	app.get('*', loggedIn, function(req, res) {
		res.redirect('/error');
	});
}
