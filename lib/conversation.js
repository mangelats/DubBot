'use strict';

const checkArgs = require('./utils/typecheck.js');


//After half an hour the conversation object gets destroyed.
//This avoids the app of eating the entire memory of the server.
class Conversation {
	constructor(data, dubbot) {
		this.clearTime = 1800000; //30 minutes

		dubbot.pm._byUsers[data.usersid] = this;
		dubbot.pm._current[data._id] = this;

		this.id = data._id;
		this.usersid = data.usersid;
		this.dubbot = dubbot;
		this.clearTimer = undefined;

		this.update(data);

		this.c = false;
	}
	send(message) {
		checkArgs(arguments, ['String'], "[Conversation] send", 1);

		this.dubbot.protocol.pm.send(this.id, message);
	}
	update(data) {
		clearTimeout(this.clearTimer);
		
		this.isNew = (data.created == data.latest_message);
		this.lastestMessage = data.latest_message_str;
		if (this.lastestMessage === undefined) {
			this.lastestMessage = "";
		}

		let that = this;
		this.clearTimer = setTimeout(function(){
			that.clear();
		}, that.clearTime);
	}
	//this is called after a time without using this object. It prevents the usage of memory forever.
	clear() {
		delete this.dubbot.pm._byUsers[this.usersid];
		delete this.dubbot.pm._current[this.id];
	}
	toString() {
		return this.lastestMessage;
	}
}

module.exports = Conversation;