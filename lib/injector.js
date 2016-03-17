//import {Resolver} from './resolver'


//import {} from 'reflect-metadata';

import Reflect from 'harmony-reflect';


export class Injector {
	constructor(...modules) {
		this._modules = modules;
		console.log(modules);
		console.log(Object.keys(Reflect));
		modules.forEach((e)=> {
			console.log(e);
			console.log(Reflect.ownKeys(e.constructor.prototype));
		});

	}

	/*
		TODO: right now only support constructor injection
		injectMembers(instance) {
	}
	*/

	/*
	 A Provider is a function that creates instances for a particular key/class
	 */
	getProvider(key) {
		throw new Error('Unable to find provider for ' + key);
		return null;
	}

	/* 
	 Retrieve an instance for a key, same as getProvider(key)();
	 */
	get(key) {
		return this.getProvider(key)();
	}

	getParent() {
		return null;
	}
}
