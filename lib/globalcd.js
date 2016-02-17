'use strict';

const roles = require('./data/roles.js');

//makes the numbers objects so 2 of them are actually the same (AKA pointer)
//otherwise only one number of the pair would update
class Objectify {
	constructor(value) {
		this._value = value;
	}
	get value() { return this._value; }
	set value(n) { this._value = n; }
}

class GlobalCD {
	constructor() {
		this.users = {};

		//set default cd to 0
		this.cooldown = {};
		this.cooldown['co-owner'] = this.cooldown[roles['co-owner'].id] = new Objectify(0);
		this.cooldown['manager'] = this.cooldown[roles['manager'].id] = new Objectify(0);
		this.cooldown['mod'] = this.cooldown[roles['mod'].id] = new Objectify(0);
		this.cooldown['vip'] = this.cooldown[roles['vip'].id] = new Objectify(0);
		this.cooldown['resident-dj'] = this.cooldown[roles['resident-dj'].id] = new Objectify(0);
		this.cooldown['user'] = this.cooldown[roles['user'].id] = new Objectify(0);

	}
	setCD(role, time) {
		this.cooldown[role].value = time * 1000;
	}
	setAllCD(timeObject) {
		if (typeof timeObject != 'Object');

		for (let key in timeObject) {
			if (this.cooldown.hasOwnProperty(key)) {
				this.cooldown[key].value = timeObject[key] * 1000;
			}
		}
	}
	inCD(user) {
		return this.users[user.id] !== undefined;
	}
	used(user) {
		if (this.cooldown[user.roleid].value > 0) {

			let that = this;
			clearTimeout(this.users[user.id]);
			this.users[user.id] = setTimeout(function(){
				delete that.users[user.id];
			}, this.cooldown[user.roleid].value);

		}
	}
}

module.exports = GlobalCD;