'use strict';

const EventEmitter = require('events');
var protocol = require('./protocol.js');

const util = require('util');
const typeCheck = require('./typecheck.js');









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
Command.prototype.toString = function() {
    return this.name;
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
        Array.prototype.splice.call(arguments, 0, 1)
        return this.commands[command_name].execute.apply(this.commands[command_name], arguments);
    }
    return false;
};










//User: represents any user of the chat (the bot is also one of them)
function User(data) {
    this._id = data.userInfo.userid;
    this.username = data.username;
    this.name = data.userInfo.displayName;
    if (this.name === undefined) {
        this.name = "";
    }
}
User.prototype.kick = function(msg) {
    typeCheck.testArgs(arguments, ['String'], 0, "User.kick");
    protocol.kick(this._id, msg);
};
User.prototype.mute = function(time) {
    typeCheck.testArgs(arguments, ['Number'], 0, "User.mute");
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
    typeCheck.testArgs(arguments, ['Number'], 0, "User.ban");
    protocol.ban(this._id, time);
};
User.prototype.unban = function() {
    protocol.unban(this._id);
};
User.prototype.toString = function() {
    return this.username;
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
Song.prototype.toString = function() {
    return this.name;
};


//Message: represents a message from the chat
function Message(msg) {
    this._id = msg._id;
    this.time = new Date(msg.time);
    this.sender = new User(msg.user);
    this.content = msg.message;
}
Message.prototype.delete = function() {
    protocol.deleteChat(this._id);
};
Message.prototype.toString = function() {
    return this.content;
};











var bot;
function connected() {
    bot.emit('connected');
};
function disconnected() {
    console.log("The bot disconnected.")
    if (bot.autoreconnect) {
        setTimeout(reconnect, 5000);
        console.log("Trying to reconnect in 5 seconds...");
    }
};
function reconnect() {
    bot.start(bot.username, bot.password, room, true);
};
function chat(msg) {
    var msgo = new Message(msg);
    if (msg.message.charAt(0) == '!') {
        var s = msg.message.split(/\s/g);
        if (bot.commands.execute(s[0], s, msgo)) return;
    }
    bot.emit('chat-message', msgo);
};
function newSong(songInfo) {
    bot.currentSong = new Song(songInfo);
    bot.emit('song-change', bot.currentSong);
};




function DubBot() {
    this.commands = new CommandList();
    this.autoreconnect = false;
    this.username = '';
    this.password = '';
    this.room = '';
    this.currentSong = undefined;
    bot = this;

    //events registration
    protocol.on('connected', connected);
    protocol.on('disconnected', disconnected);
    protocol.on('song-change', newSong);
    protocol.on('chat-message', chat);
}
DubBot.prototype.start = function(username, password, room, autoreconnect) {
    typeCheck.testArgs(arguments, ['String', 'String', 'String', 'Boolean'], 3, "DubBot.start");

    this.username = username;
    this.password = password;
    this.room = room;
    if (autoreconnect != undefined) {
        this.autoreconnect = autoreconnect;
    }

    protocol.connect(username, password, room);
};
DubBot.prototype.addCommand = function(cmd, cd, callback) {
    typeCheck.testArgs(arguments, ['String', 'Number', 'Function'], 3, "DubBot.addCommand");

    if (cmd.charAt(0) != '!') return;

    bot.commands.add(new Command(cmd, cd*1000, callback));
};
DubBot.prototype.say = function(msg) {
    typeCheck.testArgs(arguments, ['String'], 1, "DubBot.say");

    protocol.sendMsg(msg);
};
util.inherits(DubBot, EventEmitter);




module.exports = new DubBot();