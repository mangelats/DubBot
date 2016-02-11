'use strict';


//checkArgs function
const checkArgs = require('./../utils/typeCheck.js');
//check for request errrors
const errorCheck = require('./../utils/errorcheck.js');


class SongProtocol {
	constructor(request) {
		this.request = request;
	}

	search(type, name, nextPageToken, callback) {
		checkArgs(arguments, ['String', 'String', ['String', 'Function'], 'Function'], "[Protocol] song.info", 2);

		if (nextPageToken !== undefined) {
			if (nextPageToken.constructor === Function) {
				callback = nextPageToken;
				nextPageToken = '';
			}
		} else {
			nextPageToken = '';
		}

		this.request({
			method: 'GET',
			url: 'song?name='+name+'&type='+type+'&details=1&nextPageToken='+nextPageToken
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] song.info")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	info(song, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] song.info", 1);

		this.request({
			method: 'GET',
			url: 'song/' + song
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] song.info")) return;
			if (callback != undefined) callback(response);
		});
	}

	link(songId, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] song.info", 1);

		this.request({
			method: 'GET',
			url: 'song/' + songId + '/redirect'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] song.info")) return;
			if (callback != undefined) callback(response.caseless.dict.location);
		});
	}
}

module.exports = SongProtocol;