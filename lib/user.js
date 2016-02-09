'use strict';

const checkArgs = require('./utils/typecheck.js');

class User {
	constructor(data, room) {
		this.room = room;
		this.dubbot = room.dubbot;

		if (data.userInfo !== undefined) {
			this._id = data.userInfo.userid;
			this.username = data.username;
			if (this.name == undefined) {
				this.name = "";
			}
		} else {
			this._id = data._id;
			this.username = data.username;
			this.name = "";
		}
	}

	kick(msg) {
		checkArgs(arguments, ['String'], "[user] kick");

		this.dubbot.protocol.room.kick(this.room.id, this.id, this.room.realTimeChannel, msg);
	}
	mute(time) {
		checkArgs(arguments, ['Number'], "[user] mute");

		this.dubbot.protocol.room.mute(this.room.id, this.id, this.room.realTimeChannel);

		setTimeout(this.unmute, time*60000);
	}
	unmute() {
		that.dubbot.protocol.room.unmute(this.room.id, this.id, this.room.realTimeChannel);
	}
	ban(time) {
		checkArgs(arguments, ['Number'], "[user] ban");

		that.dubbot.protocol.room.ban(this.room.id, this.id, this.room.realTimeChannel, time);
	}
	unban() {
		that.dubbot.protocol.room.unban(this.room.id, this.id, this.room.realTimeChannel);
	}

	toString() {
		return this.username;
	}
}

module.exports = User;