'use strict';

function ordinal(n) {
	if (n < 10 || n > 20) //the number between 10 and 20 are all Nth (in case someone makes a crazy function)
	{
		var m = n%10;
		if (m == 1) {
			return n+"st";
		} else if (m == 2) {
			return n+"nd";
		} else if (m == 3) {
			return n+"rd";
		}
	}
	return n+"th";
}
function BadTypeException(type, possible, n, where) {
	this.message = "Tried to use the type '" + type + "'";

	if (n !== undefined) {
		this.message += " at the " + ordinal(n+1) + " argument";
	}

	if (where != undefined) {
		this.message += " on '" + where + "'";
	}

	this.message += ". Expecting the type";

	if (possible.length > 1) this.message += "s";
	for (let i in possible) {
		if (i > 1) {
			this.message += " '" + possible[i] + "',";
		} else if (i == 1) {
			this.message += " '" + possible[i] + "' or";
		} else {//i == 0
			this.message += " '" + possible[i] + "'.";
		}
	}


	this.type = 'BadTypeException';
	this.where = where;
	this.toString = function() { return this.type + ": " + this.message; };
}



function TooFewArgsException(current, expected, where) {
	this.message = "Expected a minimum of " + expected + " arguments at " + where + ". Recived " + current;
	this.type = "TooFewArgsException";
	this.where = where;
	this.toString = function() { return this.type + ": " + this.message; };
}





function testType(variable, possible, where, n) {
	if (n < 0) n = undefined;
	var found = false;
	var type = variable.constructor.name;
	var i;
	for (i = 0; !found && i < possible.length; ++i) {
		if (possible[i] !== undefined && (possible[i]).constructor !== String) {
			possible[i] = (possible[i]).constructor.name;
		}
		if (type === possible[i]) {
			found = true;
		}
	}
	if (!found) {
		throw new BadTypeException(type, possible, n, where);
	}
}
function checkArgs(args, possibleTypes, where, minArgs) {
	let u = 0;
	for (let n of args) {
		if (n === undefined) ++u;
	}
	var l = Math.min(args.length-u, possibleTypes.length);
	if (minArgs && l < minArgs) {
		throw new TooFewArgsException(l, minArgs, where);
	}
	for (let i = 0; i < l; ++i) {
		if ((possibleTypes[i]).constructor !== Array) {
			possibleTypes[i] = [possibleTypes[i]];
		}
		testType(args[i], possibleTypes[i], where, i);
	}
}
module.exports = checkArgs;