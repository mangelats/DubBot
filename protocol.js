// 
//  This file contains how the communication between the server
// and the client is done. Most of the data is kept and returned
// raw (probably will need external code to get the required
// information about them).
// 
// Author: Copying
// 

'use strict';

const EventEmitter = require('events');
const PubNub = require('pubnub');

const util = require('util');

var request = require('request');




//utils
const messageTypes = {
    chat: 'chat-message',
    songUpdate: 'room_playlist-update'
};
function encodeHTML(str) {
    if (typeof str !== 'string') return str;

    return str.replace(/&/g, "&amp;")
              .replace(/'/g, "&#39;")
              .replace(/"/g, "&#34;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;");
}
function correctCode(error, response, where) {
    if (error) {
        console.error(where + " Error on the connection: " + error);
        return false
    }

    if (response.statusCode !== 200) {
        console.error(where + " Some unxpected HTTP status code has been recived: " + response.statusCode);
        return false;
    }

    return true;
}




// internal variables
var cookiesJar = request.jar();     //Where the cookies are saved

var room;           //room id (at the start, room url)
var chatChannel;    //pubnub's chat channel
var pubnub;         //PubNub object (chat reciver)







//Configure the connection
request = request.defaults({        //set defaults for the requests
    baseUrl: 'https://api.dubtrack.fm/',
    followRedirect: false,
    json: true,
    gzip: true,
    jar: cookiesJar
});









//public interface
function Protocol() {
    EventEmitter.call(this);
    
    this.connected = false;     //If the bot is connected
    this.me = undefined;        //Bot's user basic information
    this.currentSongID = '';    //Current song's ID.
}

Protocol.prototype.connect = function(username, password, r) {
    room = r;

    //log in
    request({
        method: 'POST',
        url: 'auth/dubtrack',
        form: {
            username: username,
            password: password
        }
    }, loginResponse);
};
Protocol.prototype.sendMsg = function(message) {
    if (!this.connected) return;

    request({
        method: 'POST',
        url: 'chat/' + room,
        body: {
            type: messageTypes.chat,
            realTimeChannel: chatChannel,
            time: Date.now(),
            message: message
        }
    }, funtion(error, response, body){
        correctCode(error, response, "[Chat Message Sending]");
    });
};
Protocol.prototype.deleteChat = function(chatID) {
    if (!this.connected) return;

    request({
        method: 'DELETE',
        url: 'chat/' + room + '/' + chatID
    }, funtion(error, response, body){
        correctCode(error, response, "[Chat Message Deletion]");
    });
};
Protocol.prototype.updub = function() {
    if (!this.connected) return;

    request({
        method: 'POST',
        url: 'room/' + room + '/playlist/' + this.currentSongID +'/dubs',
        form: {
            type: 'updub'
        }
    }, funtion(error, response, body){
        correctCode(error, response, "[Song Updub]");
    });
};
Protocol.prototype.downdub = function() {
    if (!this.connected) return;
    
    request({
        method: 'POST',
        url: 'room/' + room + '/playlist/' + this.currentSongID +'/dubs',
        form: {
            type: 'downdub'
        }
    }, funtion(error, response, body){
        correctCode(error, response, "[Song Downdub]");
    });
};
Protocol.prototype.skip = function() {
    if (!this.connected || this.currentSongID == '') return;

    request({
        method: 'POST',
        url: 'chat/skip/' + room + '/' + this.currentSongID,
        form: {
            realTimeChannel: chatChannel
        }
    }, funtion(error, response, body){
        correctCode(error, response, "[Song Skip]");
    });
};
Protocol.prototype.kick = function(userID, msg) {
    if (!this.connected) return;

    request({
        method: 'POST',
        url: 'chat/kick/' + room + '/user/' + userID,
        form: {
            realTimeChannel: chatChannel,
            message: msg ? encodeHTML(msg) : ''
        }
    }, funtion(error, response, body){
        correctCode(error, response, "[User Kick]");
    });
};
Protocol.prototype.mute = function(userID) {
    if (!this.connected) return;

    request({
        method: 'POST',
        url: 'chat/mute/' + room + '/user/' + userID,
        form: {
            realTimeChannel: chatChannel
        }
    }, funtion(error, response, body){
        correctCode(error, response, "[User Mute]");
    });
};
Protocol.prototype.unmute = function(userID) {
    if (!this.connected) return;

    request({
        method: 'DELETE',
        url: 'chat/mute/' + room + '/user/' + userID,
        form: {
            realTimeChannel: chatChannel
        }
    }, funtion(error, response, body){
        correctCode(error, response, "[User Unmute]");
    });
};
Protocol.prototype.ban = function(userID, time) {
    if (!this.connected) return;

    request({
        method: 'POST',
        url: 'chat/ban/' + room + '/user/' + userID,
        form: {
            realTimeChannel: chatChannel,
            time: (time && time > 0) ? time : 0
        }
    }, funtion(error, response, body){
        correctCode(error, response, "[User Ban]");
    });
};
Protocol.prototype.unban = function(userID) {
    if (!this.connected) return;

    request({
        method: 'DELETE',
        url: 'chat/ban/' + room + '/user/' + userID,
        form: {
            realTimeChannel: chatChannel
        }
    }, funtion(error, response, body){
        correctCode(error, response, "[User Unban]");
    });
};
util.inherits(Protocol, EventEmitter);









//private interface (where things really happen)
//Mostly a hidden chain of callbacks

//log in and connection chain
function loginResponse(error, response, body) {
    if (!correctCode(error, response, "[Log in]")) return;

    //get information of the user who connected.
    request({
        method: 'GET',
        url: 'auth/session'
    }, sessionResponse);
}
function sessionResponse(error, response, body) {
    if (!correctCode(error, response, "[Connecting]")) return;

    //save the basic information about the bot as user
    protocol.me = {
        username: body.data.username,
        _id: body.data._id
    };

    //prepare client to connect the chat (requires the id which we didn't know 'till now)
    pubnub = PubNub({
        backfill: false,
        restore: false,
        subscribe_key: 'sub-c-2b40f72a-6b59-11e3-ab46-02ee2ddab7fe', //found the key randomly... seems to work perfectly though
        ssl: true,
        uuid: protocol.me._id
    });

    //get information about the room (used to connect)
    request({
        method: 'GET',
        url: ('room/' + room)
    }, roomInfoResponse);
}
function roomInfoResponse(error, response, body) {
    correctCode(error, response, "[Connecting]");

    chatChannel = body.data.realTimeChannel;
    room = body.data._id;
    pubnub.subscribe({
        channel: chatChannel,
        connect: ready,
        disconnect: disconnected,
        message: chatEvent,
        error: chatErrorEvent
    });

}
function ready(msg) {
    //aks for the current song
    request({
        method: 'GET',
        url: 'room/' + room + '/playlist/active'
    }, function(error, response, body){
        correctCode(error, response, "[Getting song]");
        onSongUpdate(body.data.songInfo);
    });

    protocol.connected = true;
    protocol.emit('connected');
}
function disconnected(msg) {
    this.connected = false;
    this.me = undefined;
    this.currentSongID = '';

    console.log("You disconnected from the server");

    protocol.emit('disconnected');
}
function chatEvent(msg) {
    if (msg.type == messageTypes.chat) {
        protocol.emit('chat', msg.message, msg.user, msg.time, msg._id);
    } else if (msg.type == messageTypes.songUpdate){
        onSongUpdate(msg.songInfo);
    }
}
function chatErrorEvent(err) {
    console.error(err);
}
function onSongUpdate(songInfo) {
    if (songInfo != undefined && protocol.currentSongID != songInfo._id) {
        protocol.currentSongID = songInfo._id;
        protocol.emit('newSong', songInfo);
    }
}


var protocol = new Protocol();
module.exports = protocol;