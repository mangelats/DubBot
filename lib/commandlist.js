'use strict';

const Command = require('./command.js');

class CommandList {
	constructor() {
		this._commands = {};

	}

	add(name, cd, callback) {
		//overides (if exists)
		this._commands[name] = new Command(name, cd, callback);
	}
	remove(name) {
		if (this._commands[name] != undefined) {
			delete this._commands[name];
			return true;
		}
		return false;
	}
	alias(original, alias) {
		//overrides (if exists)
		if (this._commands[original] != undefined) {
			this._commands[alias] = this._commands[original];
		}
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