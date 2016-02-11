'use strict';

const roles = require('./data/roles.dj');

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

		//set default cd
		this.cooldown = {};
		this.cooldown['co-owner'] = this.cooldown[roles['co-owner'].id] = Objectify(0);
		this.cooldown['manager'] = this.cooldown[roles['manager'].id] = Objectify(0);
		this.cooldown['mod'] = this.cooldown[roles['mod'].id] = Objectify(0);
		this.cooldown['vip'] = this.cooldown[roles['vip'].id] = Objectify(10000); //10 seconds
		this.cooldown['resident-dj'] = this.cooldown[roles['resident-dj'].id] = Objectify(20000); //20 seconds
		this.cooldown['user'] = this.cooldown[roles['user'].id] = Objectify(40000); //40 seconds

	}
	setCD(role, time) {
		this.cooldown[role].value = time * 1000;
	}
	inCD(user) {
		return this.users[user.id] !== undefined;
	}
	used(user) {
		if (this.cooldown[this.user.roleid] > 0) {
			clearTimeout(this.users[user.id]);
			this.users[user.id] = setTimeout(function(){
				delete this.cooldown[this.user.roleid];
			}, this.cooldown[this.user.roleid]);
		}
	}
}

module.exports = GlobalCD;