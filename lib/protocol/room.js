'use strict';


//checkArgs function
const checkArgs = require('./../utils/typeCheck.js');
//check for request errrors
const errorCheck = require('./../utils/errorcheck.js');


class RoomProtocol {
	constructor(request) {
		this.request = request;
		
		this.queue = new (require('./room/queue.js'))(request);
		this.userQueue = new (require('./room/userqueue.js'))(request);
	}

	listPublic(callback) {
		checkArgs(arguments, ['Function'], "[Protocol] publicRoomsList");

		this.request({
			method: 'GET',
			url: 'room'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] publicRoomsList")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	make(roomObject, callback) {
		checkArgs(arguments, ['Obejct', 'Function'], "[Protocol] makeRoom", 1);

		this.request({
			method: 'POST',
			url: 'room',
			form: roomObject
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] makeRoom")) return;
			if (callback != undefined) callback(body);
		});
	}

	update(roomObject, callback) {
		checkArgs(arguments, ['Obejct', 'Function'], "[Protocol] updateRoom", 1);

		this.request({
			method: 'PUT',
			url: 'room',
			form: roomObject
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] updateRoom")) return;
			if (callback != undefined) callback(body);
		});
	}

	info(room, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] roomDetails", 1);

		this.request({
			method: 'GET',
			url: 'room/' + room
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] roomDetails")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	users(roomid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] roomUsers", 1);

		this.request({
			method: 'GET',
			url: 'room/' + roomid + '/users'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] roomUsers")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	muted(roomid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] roomMuted", 1);

		this.request({
			method: 'GET',
			url: 'room/' + roomid + '/users/mute'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] roomMuted")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	banned(roomid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] roombanned", 1);

		this.request({
			method: 'GET',
			url: 'room/' + roomid + '/users/ban'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] roombanned")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	userInfo(roomid, userid, callback) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[Protocol] roomUserDetails", 2);

		this.request({
			method: 'GET',
			url: 'room/' + roomid + '/users/' + userid
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] roomUserDetails")) return;
			if (callback != undefined) callback(body.data);
		});
	}
/* Need to do more tests but feels buggy / shot down. (gave me a wierd internal error)
	leave(roomid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] leaveRoom", 1);

		this.request({
			method: 'REMOVE',
			url: 'room/' + roomid + '/users'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] leaveRoom")) return;
			if (callback != undefined) callback(respons);
		});
	}
//*/
	send(roomid, message, realTimeChannel, callback) {
		checkArgs(arguments, ['String', 'String', 'String', 'Function'], "[Protocol] sendRoomMsg", 3);

		this.request({
			method: 'POST',
			url: 'chat/' + roomid,
			form: {
				message: message,
				realTimeChannel: realTimeChannel,
				time: Date.now(),
				type: 'chat-message'
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] sendRoomMsg")) return;
			if (callback != undefined) callback(body);
		});
	}

	remove(roomid, msgid, callback) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[Protocol] deleteRommMsg", 2);

		this.request({
			method: 'DELETE',
			url: 'chat/' + roomid + '/' + msgid
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] deleteRommMsg")) return;
			if (callback != undefined) callback(body);
		});
	}

	kick(roomid, userid, realTimeChannel, message, callback) {
		checkArgs(arguments, ['String', 'String', 'String', ['String', 'Function'], 'Function'], "[Protocol] kickUser", 2);

		if (message === undefined) {
			message = '';
		} else if (message.constructor === Function) {
			callback = message;
			message = '';
		}

		this.request({
			method: 'POST',
			url: 'chat/kick/' + roomid + '/user/' + userid,
			form: {
				realTimeChannel: realTimeChannel,
				message: message
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] kickUser")) return;
			if (callback != undefined) callback(body);
		});
	}

	mute(roomid, userid, realTimeChannel, callback) {
		checkArgs(arguments, ['String', 'String', 'String', 'Function'], "[Protocol] muteUser", 2);

		this.request({
			method: 'POST',
			url: 'chat/mute/' + roomid + '/user/' + userid,
			form: {
				realTimeChannel: realTimeChannel
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] muteUser")) return;
			if (callback != undefined) callback(body);
		});
	}

	unmute(roomid, userid, realTimeChannel, callback) {
		checkArgs(arguments, ['String', 'String', 'String', 'Function'], "[Protocol] unmuteUser", 2);

		this.request({
			method: 'DELETE',
			url: 'chat/mute/' + roomid + '/user/' + userid,
			form: {
				realTimeChannel: realTimeChannel
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] unmuteUser")) return;
			if (callback != undefined) callback(body);
		});
	}

	ban(roomid, userid, realTimeChannel, time, callback) {
		checkArgs(arguments, ['String', 'String', 'String', ['Number', 'Function'], 'Function'], "[Protocol] banUser", 3);

		if (time === undefined) {
			time = 0;
		} else if (time.constructor === Function) {
			callback = time;
			time = 0;
		}

		this.request({
			method: 'POST',
			url: 'chat/ban/' + roomid + '/user/' + userid,
			form: {
				realTimeChannel: realTimeChannel,
				time: time
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] banUser")) return;
			if (callback != undefined) callback(body);
		});
	}

	unban(roomid, userid, realTimeChannel, callback) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[Protocol] room.unban", 2);

		this.request({
			method: 'DELETE',
			url: 'chat/ban/' + roomid + '/user/' + userid,
			form: {
				realTimeChannel: realTimeChannel
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] room.unban")) return;
			if (callback != undefined) callback(body);
		});
	}

	setRole(roomid, userid, roleid, callback) {
		checkArgs(arguments, ['String', 'String', 'String', 'Function'], "[Protocol] room.setRole", 3);

		this.request({
			method: 'POST',
			url: 'chat/' + roleid + '/' + roomid + '/user/' + userid
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] room.setRole")) return;
			if (callback != undefined) callback(body.data);
		});
	}
	removeRole(roomid, userid, callback) {
		this.request({
			method: 'REMOVE',
			url: 'chat/0/' + roomid + '/user/' + userid
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] room.setRole")) return;
			if (callback != undefined) callback(body);
		});
	}

}

module.exports = RoomProtocol;