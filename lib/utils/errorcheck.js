'use strict';

function errorCheck(error, response, body, where) {
	if (error) {
		console.error(where + " Error on the connection: " + error);
		return false
	}

	if (response.statusCode !== 200 && response.statusCode !== 301 && response.statusCode !== 302) {
		console.error(where + " Some unxpected HTTP status code has been recived: " + response.statusCode + " (" + response.statusMessage + ")");
		return false;
	} else if (response.statusCode === 302 && response.caseless.dict.location === '/auth/login') {
		console.error(where + " requires to be logged in");
		return false;
	}

	return true;
}

module.exports = errorCheck;