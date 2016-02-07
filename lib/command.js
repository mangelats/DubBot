'use strict';

class Command {
	constructor(name, cd, func) {
		this.name = name;
		this.cooldown = cd;
		this._func = func;
		this._inCD = false;
	}

	execute() {
		if (!this._inCD && this._func !== undefined) {
			this._func.apply(this, arguments);
			if (this.cooldown > 0) {
				let that = this;
				that._inCD = true;
				setTimeout(function(){
					that._inCD = false;
				}, this.cooldown);
			}
			return true;
		}
		return false;
	}

	toString() {
		return this.name;
	}
}

module.exports = Command;