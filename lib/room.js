'use strict';


const EventEmitter = require('events');
const pubnub = require('pubnub');

const Song = require('./song.js');
const Message = require('./message.js');
const CommandList = require('./commandlist.js');

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
function doNothing(){}

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

	_join(id, realTimeChannel) {
		this.id = id;
		this.realTimeChannel = realTimeChannel;

		let that = this;

		this._pubnub = pubnub({
			backfill: false,
			restore: false,
			subscribe_key: 'sub-c-2b40f72a-6b59-11e3-ab46-02ee2ddab7fe',
			ssl: true,
			uuid: id
		});

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

			if (msgo.content.charAt(0) === '!') {
				var s = msg.message.split(/\s/g);
				if (this._commands.execute(s[0], s, msgo)) return;
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


}

module.exports = Room;