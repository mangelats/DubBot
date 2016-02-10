'use strict';

const User = require('./user.js');

class Song {
	constructor(data, room) {
		this.room = room;
		this.dubbot = room.dubbot;

		this.id = data.song._id;
		this.fkid = data.songInfo.fkid;
		this.name = data.songInfo.name;
		this.sender = undefined;

		let that = this;
		this.dubbot.protocol.user.info(data.song.userid, function(data){
			that.sender = new User(data, that.room);
		})
	}

	skip() {
		this.dubbot.protocol.queue.skip(this.room.id, this.id);
	}

	updub() {
		this.dubbot.protocol.queue.vote(this.room.id, this.id, 'updub');
	}

	downdub() {
		this.dubbot.protocol.queue.vote(this.room.id, this.id, 'downdub');
	}

	toString() {
		return this.name;
	}

	getLink(callback) {
		this.dubbot.protocol.song.link(this.id, callback);
	}
}

module.exports = Song;