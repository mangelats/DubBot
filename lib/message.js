'use strict';

const User = require('./user.js');

class Message {
	constructor(msg, room) {
		this.room = room;
		this.dubbot = room.dubbot;

		this.id = msg._id;
		this.time = new Date(msg.time);
		this.sender = new User(msg.user, this.room, msg.queue_object);
		this.content = msg.message;
	}

	remove() {
		this.dubbot.room.remove(this.room.id, this.id);
	}

	toString() {
		return this.content;
	}
}

module.exports = Message;