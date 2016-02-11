'use strict';


//checkArgs function
const checkArgs = require('./../utils/typeCheck.js');
//check for request errrors
const errorCheck = require('./../utils/errorcheck.js');


class UserProtocol {
	constructor(request) {
		this.request = request;
	}


	info(user, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] user.info", 1);

		this.request({
			method: 'GET',
			url: 'user/' + user
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] user.info")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	image(userid, large, callback) {
		checkArgs(arguments, ['String', ['Boolean', 'Function'], 'Function'], "[Protocol] user.image", 1);

		if (large !== undefined) {
			if (large.constructor === Function) {
				callback = large;
				large = false;
			}
		} else {
			large = false;
		}

		this.request({
			method: 'GET',
			url: 'user/' + userid + '/image' + (large ? '/large' : '')
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] user.image")) return;
			if (callback != undefined) callback(response.caseless.dict.location);
		});
	}

	followers(userid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] following", 1);

		this.request({
			method: 'GET',
			url: 'user/' + userid + '/following'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] following")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	follow(userid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] follow", 1);

		this.request({
			method: 'POST',
			url: 'user/' + userid + '/following'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] follow")) return;
			if (callback != undefined) callback(body.data);
		});
	}

	unfollow(userid, callback) {
		checkArgs(arguments, ['String', 'Function'], "[Protocol] unfollow", 1);

		this.request({
			method: 'DELETE',
			url: 'user/' + userid + '/following'
		}, function(error, response, body){
			if (!errorCheck(error, response, body, "[Protocol] unfollow")) return;
			if (callback != undefined) callback(body.data);
		});
	}
}

module.exports = UserProtocol;