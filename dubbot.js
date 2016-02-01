'use strict';

const EventEmitter = require('events');
var protocol = require('./protocol.js');

const util = require('util');









//Command: represents a command
function Command(name, cooldown, func) {
    if (name === undefined) throw "[Command] constructor: there is no name for the command";
    this.name = name;
    this.cooldown = (cooldown !== undefined) ? cooldown : 0;
    this.func = func;
    this.inCD = false;
}
Command.prototype.execute = function() {
    if (!this.inCD && this.func !== undefined) {
        this.func.apply(this, arguments);
        if (this.cooldown > 0) {
            var that = this;
            that.inCD = true;
            setTimeout(function(){
                that.inCD = false;
            }, this.cooldown);
        }
        return true;
    }
    return false;
};
//CommandList: A container of Commands
function CommandList() {
    this.commands = new Object();
}
CommandList.prototype.add = function(command) {
    //if doesn't exist, we add it;
    if (this.commands[command.name] === undefined) {
        this.commands[command.name] = command;
        return true;
    }
    return false;
};
CommandList.prototype.remove = function(command) {
    //actual removal of the command (having the name)
    function rm(str) {
        if (this.commands[str] !== undefined) {
            delete this.commands[str];
            return true;
        } 
        return false;
    }

    //get the name (depending if it is a string [name] or it is a command object)
    if (typeof command == 'string') {
        return rm(command);
    } else if (typeof command == 'object' && command !== undefined && command.name !== undefined) {
        return rm(command.name);
    }
};
CommandList.prototype.execute = function(command_name) {
    if (this.commands[command_name] !== undefined) {
        return this.commands[command_name].execute.apply(this.commands[command_name], arguments);
    }
    return false;
};










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
        var id = this._id;
        setTimeout(function(){
            protocol.unmute(id);
        }, time*1000);
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
    this.commands = new CommandList();
    this.autoreconnect = false;
    this.username = '';
    this.password = '';
    this.room = '';
    this.currentSong = undefined;
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
    bot.currentSong = new Song(songInfo);
    bot.emit('song', bot.currentSong);
};
DubBot.prototype.chat = function(msg) {
    var msgo = new Message(msg);
    if (msg.message.charAt(0) == '!') {
        var s = msg.message.split(/\s/g);
        if (bot.commands.execute(s[0], s, msgo)) return;
    }
    bot.emit('chat', msgo);
};
DubBot.prototype.addCommand = function(cmd, cd, callback) {
    if (cmd.charAt(0) != '!') return;

    bot.commands.add(new Command(cmd, cd*1000, callback));
};
util.inherits(DubBot, EventEmitter);

module.exports = new DubBot();