var Q = require('q');
var request = require('request-promise');

// For Scott
exports.spawnChildProcess = function() {
	// Spawn a python child process
	// read file or simple print statement
};

exports.getTrackFeatures = function(trackId, api) {
	var deferred = Q.defer();
	var req_url = "https://api.spotify.com/v1/audio-features/" + trackId;

	var rel_req_options = {
		url: req_url,
		headers: {
			'Authorization': 'Bearer ' + api.getAccessToken()
		}
	};

	request(rel_req_options)
		.then(function(res){
			deferred.resolve(JSON.parse(res));
		})
		.catch(function(err){
			console.log(err);
		});

	return deferred.promise;
}

exports.getTracksFeatures = function(trackIds, api) {
	var self = this;
	var deferred = Q.defer();
	var promiseArray = [];
	for (var i = 0; i < trackIds.length; ++i) {
		promiseArray.push(self.getTrackFeatures(trackIds[i], api));
	}

	var allFeatures = [];
	Q.all(promiseArray).done(function(values){
		deferred.resolve(values);
	});

	return deferred.promise;
};

exports.getPlaylistTracks = function(userId, pId, api) {
	var deferred = Q.defer();
	var self = this;
	var req_url = "https://api.spotify.com/v1/users/" + userId + "/playlists/" + pId + "/tracks";
	var rel_req_options = {
		url: req_url,
		headers: {
			'Authorization': 'Bearer ' + api.getAccessToken()
		}
	};

	var trackIds = [];
	request(rel_req_options)
		.then(function(res){
			var data = JSON.parse(res);
			var tracks = data.items;
			for (var i = 0; i < tracks.length; ++i) {
				trackIds.push(tracks[i].track.id);
			}
			deferred.resolve(trackIds);
		})
		.catch(function(err){
			console.log(err);
		});

	return deferred.promise;
};

exports.getGenrePlaylistIds = function(genreId, api) {
	var deferred = Q.defer();
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

			for (var i = 0; i < playlists.length; ++i) {
				var playlistId = playlists[i].id;
				var userId = playlists[i].owner.id;
				deferred.resolve({
					uId: userId,
					pId: playlistId
				});
				break;
			}
		})
		.catch(function(err){
			console.log(err);
		});

	return deferred.promise;
};


exports.getFeatures = function(genres, api) {
	var deferred = Q.defer();
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
					console.log("Choosing songs for " + items[i].name + " genre");
					return self.getGenrePlaylistIds(items[i].id, api);
					break;
				}
			}
		})
		.then(function(pObj){
			return self.getPlaylistTracks(pObj.uId, pObj.pId, api);
		})
		.then(function(trackIds){
			return self.getTracksFeatures(trackIds, api);
		})
		.then(function(featureArray){
			deferred.resolve(featureArray);
		})
		.catch(function(err){
			console.log(err);
		});

	return deferred.promise;
};




