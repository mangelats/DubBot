'use strict';

const checkArgs = require('./utils/typecheck.js');
const roles = require('./data/roles.js');

class User {
	constructor(data, room, queue_object) {
		this.room = room;
		this.dubbot = room.dubbot;

		if(queue_object !== undefined) {
			this.dubs = queue_object.dubs;
			this.roleid = queue_object.roleid;
		}
		this.username = data.username;
		if (data.userInfo !== undefined) {
			this.id = data.userInfo.userid;
			if (this.name == undefined) {
				this.name = "";
			}
		} else {
			this.id = data._id;
			this.name = "";
		}
		let that = this;
		this.getDubs(function(dubs){
			that.dubs = dubs;
		});
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

	sendPM(message) {
		checkArgs(arguments, ['String'], "[user] sendPM", 1);
		let that = this;
		this.dubbot.protocol.pm.get(this.id, function(data){
			that.dubbot.protocol.pm.send(data.id, message);
		});
	}

	hasRight(right) {
		return rules[this.roleid].rights.indexOf(right) >= 0;
	}

	getDubs(callback) {
		checkArgs(arguments, ['Function'], "[user] getDubs");
		if (this.dubs === undefined) {
			let that = this;
			this.dubbot.protocol.room.userInfo(this.room.id, this.id, function(data){
				that.dubs = data.dubs;
				if (callback !== undefined) callback(that.dubs);
			});
		} else {
			if (callback !== undefined) callback(this.dubs);
		}
	}

	toString() {
		return this.username;
	}
}

module.exports = User;