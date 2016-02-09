// This file contains all the possible calls to the dubtrack API made function.
// Take a look at the wiki for more information


'use strict';

//base request which the otheres are made of
const _request = require('request');

//checkArgs function
const checkArgs = require('./../utils/typeCheck.js');
//check for request errrors
const errorCheck = require('./../utils/errorcheck.js');

class Protocol {
	constructor() {
		//we make a custom request with its own cookies (allows logging in with multiple accounts)
		this.request = _request.defaults({
			baseUrl: 'https://api.dubtrack.fm/',
			followRedirect: false,
			json: true,
			gzip: true,
			jar: _request.jar()
		});

		this.account = new (require('./account.js'))(this.request);
		this.user = new (require('./user.js'))(this.request);
		this.playlist = new (require('./playlist.js'))(this.request);
		this.room = new (require('./room.js'))(this.request);
		this.song = new (require('./song.js'))(this.request);
		this.pm = new (require('./privatemessages.js'))(this.request);
	}
}

module.exports = Protocol;