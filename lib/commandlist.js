'use strict';

const Command = require('./command.js');

class CommandList {
	constructor() {
		this._commands = {};

	}

	addCommand(name, cd, callback) {
		if (this._commands[name] === undefined) {
			this._commands[name] = new Command(name, cd, callback);
		}
	}

	removeCommand(name) {
		if (this._commands[name] != undefined) {
			delete this._commands[name];
			return true;
		}
		return false;
	}

	execute(name) {
		if (this._commands[name] !== undefined) {
			Array.prototype.splice.call(arguments, 0, 1); //remove the name argument
			return this._commands[name].execute.apply(this._commands[name], arguments);
		}
		return false;
	}
}

module.exports = CommandList;