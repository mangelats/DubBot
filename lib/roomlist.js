'use strict';

const Room = require('./room.js');

class RoomList {
	constructor(dubbot) {
		this.dubbot = dubbot;
		this.rooms = {};
		this.toJoin = [];
	}

	add(room) {
		let r = new Room(room, this.dubbot);

		if (this.dubbot.connected) {
			this._joinRoom(r);
		} else {
			this.toJoin.push(r);
		}

		return r;
	}

	_joinRoom(room) {
		let that = this;
		this.dubbot.protocol.roomDetails(room._ref, function(body) {
			let id = body.data._id;
			if (that.rooms[id] === undefined) {
				room._join(id, body.data.realTimeChannel);
				that.rooms[id] = room;
			}
		});
	}

	_joinRooms() {
		if (!this.dubbot.connected) return;

		for (let room of this.toJoin) {
			this._joinRoom(room);
		}
		this.toJoin.length = 0;
	}
}

module.exports = RoomList;