'use strict';

const User = require('./user.js');

class Song {
	constructor(data, room) {
		this.room = room;
		this.dubbot = room.dubbot;

		this.id = data.song._id;
		this.songid = data.songInfo._id;
		this.fkid = data.songInfo.fkid;
		this.type = data.songInfo.type;
		this.name = data.songInfo.name;
		this.sender = undefined;

		let that = this;
		this.dubbot.protocol.user.info(data.song.userid, function(data){
			that.sender = new User(data, that.room, that.dubbot);
		})
	}

	skip() {
		this.dubbot.protocol.room.queue.skip(this.room.id, this.id);
	}

	updub() {
		this.dubbot.protocol.room.queue.vote(this.room.id, this.id, 'updub');
	}

	downdub() {
		this.dubbot.protocol.room.queue.vote(this.room.id, this.id, 'downdub');
	}

	toString() {
		return this.name;
	}

	getLink(callback) {
		if (this.type == 'youtube') {
			callback('http://youtu.be/' + this.fkid);
		} else if (this.type = 'soundcloud') {
			this.dubbot.protocol.song.link(this.songid, callback);
		}
	}
}

module.exports = Song;