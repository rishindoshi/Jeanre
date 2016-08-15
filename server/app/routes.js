var Q = require('q');
var jsonfile = require('jsonfile');
var classifier = require('./genre');
var genres = [{genre:"Party"}, {genre:"Indie"}, {genre:"Hip Hop"}];

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

	app.get('/classify', function(req, res) {
		var genre = req.query.genre;
		classifier.getFeatures(genre, api)
			.then(function(featureArray){
				var path = "/Users/rishindoshi/Documents/College/Projects/Jeanre/classification/training_data/";
				classifier.writeFeatureToFile(path, genre, featureArray);
			})
			.catch(function(err){
				console.log(err);
			});
	})

	app.get('/', loggedIn, function(req, res) {
		res.render('home', {
			genres: genres,
		});
	});

	app.get('*', loggedIn, function(req, res) {
		res.redirect('/error');
	});
}
