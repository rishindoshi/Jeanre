var Q = require('q');
var request = require('request-promise');

// For Scott
exports.spawnChildProcess = function() {
	// Spawn a python child process
	// read file or simple print statement
};

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

exports.getPlaylistTracks = function(pId. api) {
	console.log("getPlaylistTracks");
};

exports.getGenreTracks = function(genreId, api) {
	var self = this;
	var req_url = "https://api.spotify.com/v1/browse/categories/";
	var rel_req_options = {
		url: req_url + genreId + "/playlists",
		headers: {
			'Authorization': 'Bearer ' + api.getAccessToken()
		}
	};

	request(rel_req_options)
		.then(function(res){
			var data = JSON.parse(res);
			var playlists = data.playlists.items;
			var playlistId;
			for (var i = 0; i < playlists.length; ++i) {
				playlistId = playlists[i].id;
				self.getPlaylistTracks(playlistId, api);
				break;
			}
		})
		.catch(function(err){
			console.log(err);
		});
};


exports.getTracks = function(genres, api) {
	var self = this;
	var req_url = "https://api.spotify.com/v1/browse/categories";
	var rel_req_options = {
		url: req_url,
		headers: {
			'Authorization': 'Bearer ' + api.getAccessToken()
		}
	};

	request(rel_req_options)
		.then(function(res){
			var data = JSON.parse(res);
			var items = data.categories.items;

			for (var i = 0; i < items.length; ++i) {
				if (genres.indexOf(items[i].name) > -1) {
					self.getGenreTracks(items[i].id, api);
					break;
				}
			}
		})
		.catch(function(err){
			console.log(err);
		});
};

exports.formatFeatureData = function(features) {
	console.log("formatFeatureData");
};



