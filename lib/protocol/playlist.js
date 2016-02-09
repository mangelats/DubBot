'use strict';


//checkArgs function
const checkArgs = require('./../utils/typeCheck.js');
//check for request errrors
const errorCheck = require('./../utils/errorcheck.js');


class PlaylistProtocol {
	constructor(request) {
		this.request = request;
	}

	list(callback) {
		checkArgs(arguments, ['Function'], "[Protocol] playlists");

		this.request({
			method: 'GET',
			url: 'playlist'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] playlists")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	make(name, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] makePlaylist", 1);

		this.request({
			method: 'POST',
			url: 'playlist',
			form: {
				name: name
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] makePlaylist")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	remove(playlistid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] deletePlaylist", 1);

		this.request({
			method: 'DELETE',
			url: 'playlist/' + playlistid
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] deletePlaylist")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	songs(playlistid, page, name, callback) {
		checkArgs(arguments, ['String', ['Number', 'Function'], ['String', 'Function'], 'Function'], "[Protocol] playlistSongs", 1);

		if (name !== undefined && name.constructor === Function) {
			callback = name;
			name = undefined;
		}
		if (page !== undefined && page.constructor === Function) {
			callback = page;
			page = undefined;
		}


		this.request({
			method: 'GET',
			url: 'playlist/' + playlistid + '/songs',
			form: {
				page: (page ? page : ''),
				name: (name ? name : '')
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] playlistSongs")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	addSong(playlistid, type, fkid, callback) {
		checkArgs(arguments, ['String', 'String', 'String', 'Function'], "[Protocol] playlistAddSong", 3);

		this.request({
			method: 'POST',
			url: '/playlist/' + playlistid + '/songs',
			form: {
				type: type,
				fkid: fkid
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] playlistAddSong")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	removeSong(playlistid, songid, callback) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[Protocol] playlistRemoveSong", 2);

		this.request({
			method: 'DELETE',
			url: '/playlist/' + playlistid + '/songs/' + songid
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] playlistRemoveSong")) return;
			if (callback != undefined) callback(body.data);
		});
	}
}

module.exports = PlaylistProtocol;