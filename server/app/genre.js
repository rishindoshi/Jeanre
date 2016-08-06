var Q = require('q');
var request = require('request-promise');

exports.testFeatures = function(api) {
	var deferred = Q.defer();

	var req_url = "https://api.spotify.com/v1/audio-features/06AKEBrKUckW0KREUWRnvT";
	var rel_req_options = {
		url: req_url,
		headers: {
			'Authorization': 'Bearer ' + api.getAccessToken()
		}
	};

	request(rel_req_options)
		.then(function(res) {
			var data = JSON.parse(res);
			console.log(data);
		})
		.catch(function(err) {
			console.log(err);
		});
};

exports.getTrackId = function(trackName, api) {
	console.log("getTrackId");
};

exports.getTrackFeatures = function(trackId, api) {
	console.log("getTrackFeatures");
};

exports.getGenreTracks = function(genre, api) {
	console.log("getGenreTracks");
};

exports.formatFeatureData = function(features) {
	console.log("formatFeatureData");
};