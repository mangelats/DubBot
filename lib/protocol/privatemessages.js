'use strict';


//checkArgs function
const checkArgs = require('./../utils/typeCheck.js');
//check for request errrors
const errorCheck = require('./../utils/errorcheck.js');


class PMProtocol {
	constructor(request) {
		this.request = request;
	}

	list(callback) {
		checkArgs(arguments, ['Function'], "[Protocol] pm.list");

		this.request({
			method: 'GET',
			url: 'message'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] pm.list")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	checkNew(callback) {
		checkArgs(arguments, ['Function'], "[Protocol] pm.checkNew");

		this.request({
			method: 'GET',
			url: 'message/new'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] pm.checkNew")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	messages(converid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] pm.messages", 1);

		this.request({
			method: 'GET',
			url: 'message/' + converid
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] pm.messages")) return;
			if (callback != undefined) callback(body.data);
		});
	}


	get(usersid, callback) {
		checkArgs(arguments, [['String', 'Array'], 'Function'], "[Protocol] pm.get", 1);

		if (usersid.constructor === String) {
			usersid = [usersid];
		}

		if (usersid.length > 10) {
			console.log("[Protocol] pm.get conversations are up to 10 people.");
			return;
		}

		this.request({
			method: 'POST',
			url: 'message',
			form: {
				'usersid': usersid
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] pm.get")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	send(converid, message, callback) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[Protocol] pm.send", 2);

		this.request({
			method: 'POST',
			url: 'message/' + converid,
			form: {
				message: message,
				time: Date.now()
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] pm.send")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	read(converid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] pm.readed", 1);

		this.request({
			method: 'POST',
			url: 'message/' + converid + "/read"
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] pm.readed")) return;
			if (callback != undefined) callback(body.data);
		});
	}
}

module.exports = PMProtocol;