// This file contains all the possible calls to the dubtrack API made function.
// Take a look at the wiki for more information


'use strict';

//base request which the otheres are made of
const _request = require('request');

//checkArgs function
const checkArgs = require('./utils/typeCheck.js');

//check for request errrors
function errorCheck(error, response, body, where) {
	//TO DO
	return true;
}

class Protocol {
	constructor() {
		//we make a custom request with its own cookies (allows logging in with multiple accounts)
		this.request = _request.defaults({
			baseUrl: 'https://api.dubtrack.fm/',
			followRedirect: false,
			json: true,
			gzip: true,
			jar: _request.jar()
		});
	}

// ACCOUNT
	login(username, password, callback) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[Protocol] login", 2);

		this.request({
			method: 'POST',
			url: 'auth/dubtrack',
			form: {
				username: username,
				password: password
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] login")) return;
			if (callback != undefined) callback(body);
		});
	}

	loguot(callback) {
		checkArgs(arguments, ['Function'], "[Protocol] logout");

		this.request({
			method: 'GET',
			url: 'auth/logout'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] logout")) return;
			if (callback != undefined) callback(body);
		});
	}

	getSessionInfo(callback) {
		checkArgs(arguments, ['Function'], "[Protocol] getSessionInfo");

		this.request({
			method: 'GET',
			url: 'auth/session'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] getSessionInfo")) return;
			if (callback != undefined) callback(body);
		});
	}




// User
	getUserInfo(user, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] getUserInfo", 1);

		this.request({
			method: 'GET',
			url: 'user/' + user
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] getUserInfo")) return;
			if (callback != undefined) callback(body);
		});
	}

	getUserImage(userid, large, callback) {
		checkArgs(arguments, ['String', 'Boolean', 'Function'], "[Protocol] getUserImage", 2);

		this.request({
			method: 'GET',
			url: 'user/' + userid + '/image' + (large ? '/large' : '')
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] getUserImage")) return;
			if (callback != undefined) callback(body);
		});
	}

	following(userid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] following", 1);

		this.request({
			method: 'GET',
			url: 'user/' + userid + '/following'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] following")) return;
			if (callback != undefined) callback(body);
		});
	}

	follow(userid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] follow", 1);

		this.request({
			method: 'POST',
			url: 'user/' + userid + '/following'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] follow")) return;
			if (callback != undefined) callback(body);
		});
	}

	unfollow(userid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] unfollow", 1);

		this.request({
			method: 'DELETE',
			url: 'user/' + userid + '/following'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] unfollow")) return;
			if (callback != undefined) callback(body);
		});
	}

	followers(userid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] followers", 1);

		this.request({
			method: 'GET',
			url: 'user/' + userid + '/followers'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] followers")) return;
			if (callback != undefined) callback(body);
		});
	}




// PLAYLIST
	playlists(callback) {
		checkArgs(arguments, ['Function'], "[Protocol] playlists");

		this.request({
			method: 'GET',
			url: 'playlist'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] playlists")) return;
			if (callback != undefined) callback(body);
		});
	}

	makePlaylist(name, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] makePlaylist", 1);

		this.request({
			method: 'POST',
			url: 'playlist',
			form: {
				name: name
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] makePlaylist")) return;
			if (callback != undefined) callback(body);
		});
	}

	deletePlaylist(playlistid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] deletePlaylist", 1);

		this.request({
			method: '',
			url: ''
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] deletePlaylist")) return;
			if (callback != undefined) callback(body);
		});
	}

	playlistSongs(playlistid, page, name, callback) {
		checkArgs(arguments, ['String', 'Number', 'String', 'Function'], "[Protocol] playlistSongs", 1);

		this.request({
			method: 'GET',
			url: 'playlist/' + playlistid + '/songs',
			form: {
				page: (page ? page : ''),
				name: (name ? name : '')
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] playlistSongs")) return;
			if (callback != undefined) callback(body);
		});
	}

	playlistAddSong(playlistid, type, fkid, callback) {
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
			if (callback != undefined) callback(body);
		});
	}

	playlistRemoveSong(playlistid, songid, callback) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[Protocol] playlistRemoveSong", 2);

		this.request({
			method: 'DELETE',
			url: '/playlist/' + playlistid + '/songs/' + songid
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] playlistRemoveSong")) return;
			if (callback != undefined) callback(body);
		});
	}




// ROOM
	publicRoomsList(callback) {
		checkArgs(arguments, ['Function'], "[Protocol] publicRoomsList");

		this.request({
			method: 'GET',
			url: 'room'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] publicRoomsList")) return;
			if (callback != undefined) callback(body);
		});
	}

	makeRoom(roomObject, callback) {
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

	updateRoom(roomObject, callback) {
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

	roomDetails(room, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] roomDetails", 1);

		this.request({
			method: 'GET',
			url: 'room/' + room
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] roomDetails")) return;
			if (callback != undefined) callback(body);
		});
	}

	roomUsers(roomid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] roomUsers", 1);

		this.request({
			method: 'GET',
			url: 'room/' + roomid + '/users'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] roomUsers")) return;
			if (callback != undefined) callback(body);
		});
	}

	roomUserDetails(roomid, userid, callback) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[Protocol] roomUserDetails", 2);

		this.request({
			method: 'GET',
			url: 'room/' + roomid + '/users/' + userid
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] roomUserDetails")) return;
			if (callback != undefined) callback(body);
		});
	}

	leaveRoom(roomid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] leaveRoom", 1);

		this.request({
			method: 'REMOVE',
			url: 'room/' + roomid + '/users'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] leaveRoom")) return;
			if (callback != undefined) callback(body);
		});
	}

	sendRoomMsg(roomid, message, realTimeChannel, callback) {
		checkArgs(arguments, ['String', 'String', 'String', 'Function'], "[Protocol] sendRoomMsg", 3);

		this.request({
			method: 'POST',
			url: 'room/' + roomid,
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

	deleteRommMsg(roomid, msgid, callback) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[Protocol] deleteRommMsg", 2);

		this.request({
			method: 'DELETE',
			url: 'room/' + roomid + '/' + msgid
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] deleteRommMsg")) return;
			if (callback != undefined) callback(body);
		});
	}





// ROOM MODERATION
	kickUser(roomid, userid, realTimeChannel, message, callback) {
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

	muteUser(roomid, userid, realTimeChannel, callback) {
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

	unmuteUser(roomid, userid, realTimeChannel, callback) {
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

	banUser(roomid, userid, realTimeChannel, time, callback) {
		checkArgs(arguments, ['String', 'String', 'String', ['Number', 'Function'], 'Function'], "[Protocol] banUser", 2);

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

	unbanUser(roomid, userid, realTimeChannel, callback) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[Protocol] unbanUser", 2);

		this.request({
			method: 'DELETE',
			url: 'chat/ban/' + roomid + '/user/' + userid,
			form: {
				realTimeChannel: realTimeChannel
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] unbanUser")) return;
			if (callback != undefined) callback(body);
		});
	}

	setUserRole(roomid, userid, roleid, callback) {
		checkArgs(arguments, ['String', 'String', 'String', 'Function'], "[Protocol] unbanUser", 3);

		this.request({
			method: 'POST',
			url: 'chat/' + roleid + '/' + roomid + '/user/' + userid
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] unbanUser")) return;
			if (callback != undefined) callback(body);
		});
	}




// ROOM QUEUE
	roomQueue(roomid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] roomQueue", 1);

		this.request({
			method: 'GET',
			url: 'room/' + roomid + '/playlist'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] roomQueue")) return;
			if (callback != undefined) callback(body);
		});
	}

	roomQueueDetails(roomid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] roomQueueDetails", 1);

		this.request({
			method: 'GET',
			url: 'room/' + roomid + '/playlist/details'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] roomQueueDetails")) return;
			if (callback != undefined) callback(body);
		});
	}

	currentSong(roomid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] currentSong", 1);

		this.request({
			method: 'GET',
			url: 'room/' + roomid + '/playlist/active'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] currentSong")) return;
			if (callback != undefined) callback(body);
		});
	}

	currentSongDubs(roomid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] currentSongDubs", 1);

		this.request({
			method: 'GET',
			url: 'room/' + roomid + '/playlist/active/dubs'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] currentSongDubs")) return;
			if (callback != undefined) callback(body);
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

	reorderQueue(roomid, newOeder, callback) {
		checkArgs(arguments, ['String', 'Object', 'Function'], "[Protocol] reorderQueue", 2);

		this.request({
			method: '',
			url: ''
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] reorderQueue")) return;
			if (callback != undefined) callback(body);
		});
	}

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

	queueLockState(roomid, locked, callback) {
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

// ROOM USER'S QUEUE
	userQueue(roomid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] userQueue", 1);

		this.request({
			method: 'GET',
			url: 'user/session/room/' + roomid + '/queue'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] userQueue")) return;
			if (callback != undefined) callback(body);
		});
	}

	userQueueAdd(roomid, type, fkid, callback) {
		checkArgs(arguments, ['String', 'String', 'String', 'Function'], "[Protocol] userQueueAdd", 3);

		this.request({
			method: 'POST',
			url: 'room/' + roomid + '/playlist',
			form: {
				type: type,
				fkid: fkid
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] userQueueAdd")) return;
			if (callback != undefined) callback(body);
		});
	}

	userQueueDelete(roomid, songid, callback) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[Protocol] userQueueDelete", 1);

		this.request({
			method: 'DELETE',
			url: 'room/' + roomid + '/playlist/' + songid
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] userQueueDelete")) return;
			if (callback != undefined) callback(body);
		});
	}

	userQueueDeleteAll(roomid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] userQueueDeleteAll", 1);

		this.request({
			method: 'GET',
			url: 'room/' + roomid + '/playlist'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] userQueueDeleteAll")) return;
			if (callback != undefined) callback(body);
		});
	}
}

module.exports = Protocol;