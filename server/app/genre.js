var Q = require('q');
var request = require('request-promise');
var fs = require('fs');

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

exports.getPlaylistsTracks = function(pObjs, api) {
	var self = this;
	var deferred = Q.defer();

	var promiseArray = [];
	for (var i = 0; i < pObjs.length; ++i) {
		var userId = pObjs[i].uId;
		var playlistId = pObjs[i].pId;
		promiseArray.push(self.getPlaylistTracks(userId, playlistId, api));
	}

	Q.all(promiseArray).done(function(values){
		var allTrackIds = [];
		for (var i = 0; i < values.length; ++i) {
			allTrackIds = allTrackIds.concat(values[i]);
		}
		deferred.resolve(allTrackIds.slice(0, 60));
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
			var pObjs = [];

			for (var i = 0; i < playlists.length; ++i) {
				var playlistId = playlists[i].id;
				var userId = playlists[i].owner.id;
				if (userId == "spotify") {
					pObjs.push({
						uId: userId,
						pId: playlistId
					});	
				}
			}
			deferred.resolve(pObjs);
		})
		.catch(function(err){
			console.log(err);
		});

	return deferred.promise;
};


exports.filterFeatures = function(featureArray) {
	return featureArray.map(function(featureObj) {
		var newObj = {};
		for (feature in featureObj) {
			if (typeof featureObj[feature] == "number") {
				newObj[feature] = featureObj[feature];
			}
		}
		return newObj;
	});
};

exports.formatFeatures = function(featureArray) {
	var formattedArray = [];

	var featureNames = [];
	for (featureName in featureArray[0]) {
		featureNames.push(featureName);
	}
	formattedArray.push(featureNames);

	featureArray.forEach(function(featureObj) {
		var vals = [];
		for (feature in featureObj) {
			vals.push(featureObj[feature]);
		}
		formattedArray.push(vals);
	});

	return formattedArray;
};

exports.getFeatures = function(genre, api) {
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
				if (items[i].name == genre) {
					console.log("Choosing songs for " + items[i].name + " genre");
					return self.getGenrePlaylistIds(items[i].id, api);
					break;
				}
			}
		})
		.then(function(pObjs){
			return self.getPlaylistsTracks(pObjs, api);
		})
		.then(function(trackIds){
			return self.getTracksFeatures(trackIds, api);
		})
		.then(function(featureArray){
			var relFeatures = self.filterFeatures(featureArray);
			var formattedFeatures = self.formatFeatures(relFeatures);
			deferred.resolve(formattedFeatures);
		})
		.catch(function(err){
			console.log(err);
		});

	return deferred.promise;
};

exports.writeFeatureToFile = function(path, genre, featureArray) {
	var file = fs.createWriteStream(path + genre + ".txt");
	file.on('error', function(err) { console.log(err) });
	featureArray.forEach(function(v) { file.write(v.join(', ') + '\n'); });
	file.end();
};





