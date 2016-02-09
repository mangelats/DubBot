'use strict';


//checkArgs function
const checkArgs = require('./../utils/typeCheck.js');
//check for request errrors
const errorCheck = require('./../utils/errorcheck.js');


class AccountProtocol {
	constructor(request) {
		this.request = request;
	}

	login(username, password, callback) {
		checkArgs(arguments, ['String', 'String', 'Function'], "[Protocol] login", 2);

		this.request({
			method: 'POST',
			url: 'auth/dubtrack',
			form: {
				username: username,
				password: password
			}
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] login")) return;
			if (callback != undefined) callback();
		});
	}

	logout(callback) {
		checkArgs(arguments, ['Function'], "[Protocol] logout");

		this.request({
			method: 'GET',
			url: 'auth/logout'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] logout")) return;
			if (callback != undefined) callback();
		});
	}

	info(callback) {
		checkArgs(arguments, ['Function'], "[Protocol] getSessionInfo");

		this.request({
			method: 'GET',
			url: 'auth/session'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] getSessionInfo")) return;
			if (callback != undefined) callback(body ? body.data : undefined);
		});
	}
}

module.exports = AccountProtocol;