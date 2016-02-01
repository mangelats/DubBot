'use strict';

const EventEmitter = require('events');
var protocol = require('./protocol.js');
var request = require('request');

const util = require('util');



// TO DO: check all the constructors

//User: reporesents any user of the chat (the bot is also one of them)
function User(data) {
    this._id = data.userInfo.userid;
    this.username = data.username;
    this.name = data.userInfo.displayName;
    if (this.name === undefined) {
        this.name = "";
    }
}
User.prototype.kick = function(msg) {
    protocol.kick(this._id, msg);
};
User.prototype.mute = function(time) {
    protocol.mute(this._id);
    if (time !== undefined && time > 0) {
        setTimeout(this.unmute, time);
    }
};
User.prototype.unmute = function() {
    protocol.unmute(this._id);
};
User.prototype.ban = function(time) {
    protocol.ban(this._id, time);
};
User.prototype.unban = function() {
    protocol.unban(this._id);
};



//Song: represents a song
function Song(data) {
    this._id = data.song._id;
    this.name = data.songInfo.name;

    this.permalink = data.songInfo.type == 'youtube' ? "http://youtu.be/" + data.songInfo.fkid : "";

    this.sender = undefined;
    protocol.getUser(data.song.userid, function(body, that){
        that.sender = new User(body.data);
    }, this);
}
Song.prototype.skip = function() {
    if (protocol.currentSongID != this._id) return;
    protocol.skip();
};
Song.prototype.updub = function() {
    if (protocol.currentSongID != this._id) return;
    protocol.updub();
};
Song.prototype.downdub = function() {
    if (protocol.currentSongID != this._id) return;
    protocol.downdub();
};


//Message: represents a message from the chat
function Message(msg) {
    this._id = msg._id;
    this.time = new Date(msg.time);
    this.sender = new User(msg.user);
    this.message = msg.message;
}
Message.prototype.delete = function() {
    protocol.deleteChat(this._id);
};


var bot;
//DubBot the main dish...
function DubBot() {
    this.autoreconnect = false;
    this.username = '';
    this.password = '';
    this.room = '';
    bot = this;

    //events registration
    protocol.on('connected', this.connected);
    protocol.on('disconnected', this.disconnected);
    protocol.on('newSong', this.newSong);
    protocol.on('chat', this.chat);
}
DubBot.prototype.start = function(username, password, room, autoreconnect) {
    this.username = username;
    this.password = password;
    this.room = room;
    if (autoreconnect != undefined) {
        this.autoreconnect = autoreconnect;
    }

    protocol.connect(username, password, room);
};
DubBot.prototype.connected = function() {
    bot.emit('connected');
};
DubBot.prototype.disconnected = function() {
    console.log("The bot disconnected.")
    if (bot.autoreconnect) {
        setTimeout(reconnect, 5000);
        console.log("Trying to reconnect in 5 seconds...");
    }
};
DubBot.prototype.reconnect = function() {
    bot.start(bot.username, bot.password, room, true);
};
DubBot.prototype.newSong = function(songInfo) {
    bot.emit('song', new Song(songInfo));
};
DubBot.prototype.chat = function(msg) {
    bot.emit('chat', new Message(msg));
};
util.inherits(DubBot, EventEmitter);

module.exports = new DubBot();