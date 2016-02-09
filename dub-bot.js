'use strict';

const EventEmitter = require('events');
const RoomList = require('./lib/roomlist.js');
//const Protocol = require('./protocol.js'); //set dynamically at constructor

const checkArgs = require('./lib/utils/typecheck.js');

class DubBot extends EventEmitter {
	constructor(username, password, callback, Protocol) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[DubBot] constructor", 2);

		if (Protocol == undefined) Protocol = require('./lib/protocol/protocol.js');

		super();

		this.username = username;

		this.protocol = new Protocol();
		this.rooms = new RoomList(this);
		this.connected = false;
		this.id = '';

		var that = this;
		this.protocol.account.login(username, password, function(){
			that.protocol.account.info(function(body){
				that.id = body.data._id;
				that.connected = true;
				that.emit('log in');
				that.rooms._joinRooms();
			});
		});
	}

	join(room) {
		checkArgs(arguments, ['String'], "[DubBot] join", 1);
		
		return this.rooms.add(room);
	}

	getUser(user, callback) {
		checkArgs(arguments, ['String', 'Function'], "[DubBot] join", 2);
		this.protocol.user.info(user, function(data){
			callback(new User(data));
		});
	}

	sendPM(users, message) {
		checkArgs(arguments, [['Array', 'User'], 'Function'], "[DubBot] join", 2);

		if (users.constructor !== Array) {
			users = [users];
		}

		let usersid = [];
		for (let user of users) {
			usersid.push(user.id);
		}

		let that = this;
		this.dubbot.protocol.pm.get(usersid, function(data){
			that.dubbot.protocol.pm.send(data.id, message);
		});
	}

	toString() {
		return this.username;
	}
}

module.exports = DubBot;