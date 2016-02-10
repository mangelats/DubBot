'use strict';


//checkArgs function
const checkArgs = require('./../../utils/typeCheck.js');
//check for request errrors
const errorCheck = require('./../../utils/errorcheck.js');


class RoomQueueProtocol {
	constructor(request) {
		this.request = request;
	}
	info(roomid, detailed, callback) {
		checkArgs(arguments, ['String', ['Boolean', 'Function'], 'Function'], "[Protocol] roomQueue", 1);

		if (detailed !== undefined) {
			if (detailed.constructor === Function) {
				callback = detailed;
				detailed = false;
			}
		} else {
			detailed = false;
		}

		this.request({
			method: 'GET',
			url: 'room/' + roomid + '/playlist' + (detailed ? '/details' : '')
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] roomQueue")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	currentSong(roomid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] currentSong", 1);

		this.request({
			method: 'GET',
			url: 'room/' + roomid + '/playlist/active'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] currentSong")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	currentSongDubs(roomid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] currentSongDubs", 1);

		this.request({
			method: 'GET',
			url: 'room/' + roomid + '/playlist/active/dubs'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] currentSongDubs")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	skip(roomid, songid, callback) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[Protocol] skip", 2);

		this.request({
			method: 'POST',
			url: 'chat/skip/' + roomid + '/' + songid
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] skip")) return;
			if (callback != undefined) callback(body);
		});
	}

//TODO check from here


/* TODO
	reorder(roomid, newOeder, callback) {
		checkArgs(arguments, ['String', 'Object', 'Function'], "[Protocol] reorderQueue", 2);

		this.request({
			method: '',
			url: ''
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] reorderQueue")) return;
			if (callback != undefined) callback(body);
		});
	}
//*/

	removeUserSong(roomid, userid, callback) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[Protocol] removeUserSong", 2);

		this.request({
			method: 'DELETE',
			url: 'room/' + roomid + '/queue/user/' + userid
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] removeUserSong")) return;
			if (callback != undefined) callback(body);
		});
	}

	removeDJ(roomid, userid, callback) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[Protocol] removeDJ", 2);

		this.request({
			method: 'DELETE',
			url: 'room/' + roomid + '/queue/user/' + userid + '/all'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] removeDJ")) return;
			if (callback != undefined) callback(body);
		});
	}

	pauseState(roomid, userid, paused, callback) {
		checkArgs(arguments, ['String', 'Boolean', 'Function'], "[Protocol] pauseState");

		this.request({
			method: 'PUT',
			url: 'room/' + roomid + '/queue/user/' + userid + '/pause',
			form: {
				pause: paused ? '1' : '0'
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] pauseState")) return;
			if (callback != undefined) callback(body);
		});
	}
	join(roomid, userid, callback){
		pauseState(roomid, userid, false, callback);
	}
	leave(roomid, userid, callback){
		pauseState(roomid, userid, true, callback);
	}

	vote(roomid, userid, dub, callback) {
		checkArgs(arguments, ['String', 'String', ['Boolean', 'String'], 'Function'], "[Protocol] vote", 2);

		this.request({
			method: 'POST',
			url: 'room/' + roomid + '/playlist/' + songid + '/dubs',
			form: {
				type: (dub.constructor === String ? dub : (dub ? 'updub' : 'downdub'))
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] vote")) return;
			if (callback != undefined) callback(body);
		});
	}

	lockState(roomid, locked, callback) {
		checkArgs(arguments, ['String', 'Boolean', 'Function'], "[Protocol] queueLock", 1);

		this.request({
			method: 'POST',
			url: 'room/' + roomid + '/lockQueue',
			form: {
				lockQueue: locked ? '1' : '0'
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] queueLock")) return;
			if (callback != undefined) callback(body);
		});
	}
	lock(roomid, callback) {
		lockState(roomid, true, callback);
	}
	unlock(roomid, callback) {
		lockState(roomid, false, callback);
	}
}

module.exports = RoomQueueProtocol;