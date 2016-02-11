'use strict';


const EventEmitter = require('events');
const pubnub = require('pubnub');

const User = require('./user.js');
const Song = require('./song.js');
const Message = require('./message.js');
const CommandList = require('./commandlist.js');
const GlobalCD = require('./globalcd,js');

const checkArgs = require('./utils/typecheck.js');

class NotACommandError {
	constructor(fake, where) {
		this.message = "Tried to add command at " + where + " without starting with exclamation mark (!) at the start (" + fake + ")";
		this.type = "NotACommandError";
		this.where = where;
	}
	toString() {
		return "[" + this.type + "] " + this.message;
	}
}

class Room extends EventEmitter {
	constructor(ref, dubbot) {
		super();

		this.dubbot = dubbot;

		this._ref = ref;
		this.id = '';
		this.realTimeChannel = '';
		this._pubnub = undefined;

		this.currentSong = undefined;

		this._commands = new CommandList();
		this.globalCD = new GlobalCD();

		this.users = {};
	}

	addCommand(name, cd, callback) {
		checkArgs(arguments, ['String', ['Number', 'Function'], 'Function'], "[Room] addCommand", 2);
		name = name.split(/\s+/g)[0];
		if (name.charAt(0) != '!') {
			throw NotACommandError(name, "[Room] addCommand");
		}

		if (cd.constructor === Function) {
			callback = cd;
			cd = 0;
		}

		this._commands.addCommand(name, cd*1000, callback);
	}
	removeCommand(name) {
		checkArgs(arguments, ['String'], "[Room] removeCommand", 1);

		return this._commands.removeCommand(name);
	}

	getUser(user, callback) {
		checkArgs(arguments, ['String', 'Function'], "[DubBot] join", 2);
		let that = this;
		this.dubbot.protocol.user.info(user, function(data){
			callback(new User(data, that, that.dubbot));
		});
	}

	say(message) {
		checkArgs(arguments, ['String'], "[Room] say", 1);
		this.dubbot.protocol.room.send(this.id, message, this.realTimeChannel);
	}

	_join(id, realTimeChannel) {
		this.id = id;
		this.realTimeChannel = realTimeChannel;

		this._pubnub = pubnub({
			backfill: false,
			restore: false,
			subscribe_key: 'sub-c-2b40f72a-6b59-11e3-ab46-02ee2ddab7fe',
			ssl: true,
			uuid: this.dubbot.id

		});

		let that = this;
		//For some reason pubnub changes the this in the callback -.-'
		this._pubnub.subscribe({
			channel: that.realTimeChannel,
			connect: function(){
				that.emit('connect');
			},
			disconnect: function(){
				that.emit('disconnect');
			},
			message: function(){
				that._onmessage.apply(that, arguments);
			},
			error: console.error
		});
	}
	_onmessage(msg) {
		if (msg.type === 'chat-message') {
			let msgo = new Message(msg, this);

			if (msgo.content.charAt(0) === '!' && !this.globalcd.inCD(msgo.sender)) {
				var s = msg.message.split(/\s/g);
				if (this._commands.execute(s[0], s, msgo)) this.globalcd.used(msgo.sender);
			}

			//This event is triggered if is is no command
			this.emit('chat-message', msgo);


		} else if (msg.type === 'room_playlist-update') {
			if (msg.song != undefined) {
				if (this.currentSong == undefined || this.currentSong.id !== msg.song._id) {
					this.currentSong = new Song(msg, this);
					this.emit('song-change', this.currentSong);
				}
			}
		}


	}

	toString() {
		return this._ref;
	}

}

module.exports = Room;