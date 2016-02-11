'use strict';

const EventEmitter = require('events');
const RoomList = require('./lib/roomlist.js');
//const Protocol = require('./protocol.js'); //set dynamically at constructor

const checkArgs = require('./lib/utils/typecheck.js');
const User = require('./lib/user.js');
const PMManager = require('./lib/conversationmanager.js');

const roles = require('./lib/data/roles.js');

class DubBot extends EventEmitter {
	constructor(username, password, callback, Protocol) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[DubBot] constructor");

		if (Protocol == undefined) Protocol = require('./lib/protocol/protocol.js');

		super();

		this.username = username;

		this.protocol = new Protocol();
		this.rooms = new RoomList(this);
		this.pm = new PMManager(this);
		this.id = '';

		this.connected = false;

		if (username !== undefined && password !== undefined) {
			var that = this;
			this.protocol.account.login(username, password, function(){
				that.protocol.account.info(function(data){
					that.id = data._id;
					that.emit('log-in');
					that.connected = true;

					//join the rooms that were waiting to log in
					that.rooms._joinRooms();

					//Start the interval to check the private messages
					that.pm._checkPM();
					that.pm.inteval = setInterval(function(){ that.pm._checkPM(); }, that.pm.time);
				});
			});
		} else {
			this.connected = true;
			this.rooms._joinRooms();
		}
	}

	join(room) {
		checkArgs(arguments, ['String'], "[DubBot] join", 1);
		
		return this.rooms.add(room);
	}

	getUser(user, callback) {
		checkArgs(arguments, ['String', 'Function'], "[DubBot] join", 2);
		let that = this;
		this.protocol.user.info(user, function(data){
			callback(new User(data, undefined, that));
		});
	}

	sendPM(users, message) {
		checkArgs(arguments, [['Array', 'User'], 'String'], "[DubBot] sendPM", 2);
		this.getConversation(users, function(conver){
			conver.send(message);
		});

	}

	getConversation(users, callback) {
		checkArgs(arguments, [['Array', 'User'], 'Function'], "[DubBot] getPMConversation", 2);

		if (users.constructor !== Array) {
			users = [users];
		}

		let usersid = [];
		for (let user of users) {
			usersid.push(user.id);
		}

		this.pm.getByUsers(usersid, callback);
	}
	_newPM(conver){
		this.emit('private-message', conver);
	}

	toString() {
		return this.username;
	}

	//DubBot.roles is a thing, now
	static get roles(){
		return roles;
	}
}

module.exports = DubBot;