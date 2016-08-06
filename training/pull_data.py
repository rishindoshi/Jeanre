#!/usr/bin/python
import json
import spotipy
import pprint
import urllib2
import spotipy.util as util

GENRES = ["jazz", "rock", "house", "country"]
NUM_TRAINING_EXAMPLES = 50


token = util.prompt_for_user_token('rdoshi25', 'user-library-read')
spotify = spotipy.Spotify(auth=token)


# for genre in GENRES:
# 	results = playlists.search(q=genre, type="playlist")

# Get first hit playlist for genre search
# results = spotify.search(q=GENRES[0], type="playlist")
# playlist = results['playlists']['items'][0]
# playlistTracksUrl = playlist['tracks']['href']
# playlistUser = playlist['owner']['id']

# pprint.pprint(playlist)
