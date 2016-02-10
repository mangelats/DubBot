'use strict';

const checkArgs = require('./utils/typecheck.js');
const roles = require('./data/roles.js');

class User {
	constructor(data, room, dubbot, queue_object) {
		this.room = room;
		this.dubbot = dubbot;

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
		this.dubs = 0;

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
		if (this.room === undefined) return;

		checkArgs(arguments, ['Number'], "[user] mute");

		this.dubbot.protocol.room.mute(this.room.id, this.id, this.room.realTimeChannel);

		let that = this;
		setTimeout(function(){
			that.unmute();
		}, time*60000);
	}

	unmute() {
		if (this.room === undefined) return;

		this.dubbot.protocol.room.unmute(this.room.id, this.id, this.room.realTimeChannel);
	}

	ban(time) {
		if (this.room === undefined) return;

		checkArgs(arguments, ['Number'], "[user] ban");

		this.dubbot.protocol.room.ban(this.room.id, this.id, this.room.realTimeChannel, time);
	}

	unban() {
		if (this.room === undefined) return;

		this.dubbot.protocol.room.unban(this.room.id, this.id, this.room.realTimeChannel);
	}

	hasRight(right) {
		if (this.room === undefined) return;

		return roles[this.roleid].rights.indexOf(right) >= 0;
	}

	getDubs(callback) {
		if (this.room === undefined) return;

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

	sendPM(message) {
		this.dubbot.getConversation(this, function(c){
			c.send(message);
		});
	}
	getConversation(callback) {
		this.dubbot.getConversation(this, callback);
	}

	toString() {
		return this.username;
	}
}

module.exports = User;