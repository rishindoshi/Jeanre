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

		classifier.getFeatures(genres, api)
			.then(function(featureArray){
				// We now have an array of feature objects
				// Iterate through the array and filter each object to only include relevent features
				// e.g Exclude keys such as (uri, duration, etc.)
				// Then write the features to a file using node streams
				// Then spawn child python process to classify input song
				// Calculate percent accuracy and render results to front-end
				console.log(featureArray);
			})
			.catch(function(err){
				console.log(err);
			});

		res.render('home', {
			user: req.user.id,
		});
	});

	app.get('*', loggedIn, function(req, res) {
		res.redirect('/error');
	});
}
