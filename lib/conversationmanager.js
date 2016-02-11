'use strict';

const Conversation = require('./conversation.js');

class ConversationManager {
	constructor(dubbot) {
		this.dubbot = dubbot;
		this._current = {};
		this._byUsers = {};

		this.time = 3000; //3 seconds

		this.interval = undefined;
	}
	getByUsers(usersid, callback) {
		if (this._byUsers[usersid] === undefined) {
			let that = this;
			this.dubbot.protocol.pm.get(usersid, function(data){
				callback(new Conversation(data, that.dubbot));
			});
		} else {
			callback(this._byUsers[usersid]);
		}
	}
	read(id, callback) {
		let that = this;
		this.dubbot.protocol.pm.read(id, function(data){
			if (that._current[id] === undefined) {
				callback(new Conversation(data, that.dubbot));
			} else {
				that._current[id].update(data);
				callback(that._current[id]);
			}
		});
	}

	get checkTime() { return this.time; }
	set checkTime(n) {
		if (n <= 0) return;

		this.time = n * 1000;
		clearInterval(this.interval);
		let that = this;
		this.interval = setInterval(function(){ that._checkPM(); }, that.time);
	}

	_checkPM() {
		let that = this;
		this.dubbot.protocol.pm.checkNew(function(data){
			if (data != undefined) {
				let n = parseInt(data, 10);
				if (n > 0) {
					that.dubbot.protocol.pm.list(function(data){
						for (let i = 0; i < n; ++i) {
							let msg = data[i];

							that.read(msg._id, function(conv){
								that.dubbot._newPM(conv);
							});

						}
					});
				}
			}
		});
	}
}

module.exports = ConversationManager;