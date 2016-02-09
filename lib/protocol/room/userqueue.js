'use strict';


//checkArgs function
const checkArgs = require('./../../utils/typeCheck.js');
//check for request errrors
const errorCheck = require('./../../utils/errorcheck.js');


class RoomUserQueueProtocol {
	constructor(request) {
		this.request = request;
	}

	list(roomid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] userQueue", 1);

		this.request({
			method: 'GET',
			url: 'user/session/room/' + roomid + '/queue'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] userQueue")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	add(roomid, type, fkid, callback) {
		checkArgs(arguments, ['String', 'String', 'String', 'Function'], "[Protocol] userQueueAdd", 3);

		this.request({
			method: 'POST',
			url: 'room/' + roomid + '/playlist',
			form: {
				songType: type,
				songId: fkid
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] userQueueAdd")) return;
			if (callback != undefined) callback(body);
		});
	}

	remove(roomid, songid, callback) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[Protocol] userQueueDelete", 1);

		this.request({
			method: 'DELETE',
			url: 'room/' + roomid + '/playlist/' + songid
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] userQueueDelete")) return;
			if (callback != undefined) callback(body);
		});
	}

	removeAll(roomid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] userQueueDeleteAll", 1);

		this.request({
			method: 'GET',
			url: 'room/' + roomid + '/playlist'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] userQueueDeleteAll")) return;
			if (callback != undefined) callback(body);
		});
	}

	order(roomid, idArray, callback) {
		checkArgs(arguments, ['String', 'Array', 'Function'], "[Protocol] userQueueOrder", 2);

		this.request({
			method: 'POST',
			url: 'room/' + roomid + '/queue/order',
			form: {
				'order[]': idArray
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] userQueuePauseState")) return;
			if (callback != undefined) callback(body);
		});
	}
//TODO check
	pauseState(roomid, userid, paused, callback) {
		checkArgs(arguments, ['String', 'Boolean', 'Function'], "[Protocol] userQueuePauseState");

		this.request({
			method: 'PUT',
			url: 'room/' + roomid + '/queue/pause',
			form: {
				pause: paused ? '1' : '0'
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] userQueuePauseState")) return;
			if (callback != undefined) callback(body);
		});
	}
}

module.exports = RoomUserQueueProtocol;