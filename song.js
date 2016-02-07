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
		this.dubbot.protocol.getUserInfo(data.song.userid, function(body){
			that.sender = new User(body, that.room);
		})
	}

	skip() {
		this.dubbot.skip(this.room.id, this.id);
	}

	updub() {
		this.dubbot.protocol.vote(this.room.id, this.id, 'updub');
	}

	downdub() {
		this.dubbot.protocol.vote(this.room.id, this.id, 'downdub');
	}

	toString() {
		return this.name;
	}
}

module.exports = Song;