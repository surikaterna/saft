import { Binder } from './binder/binder';
import { Resolver } from './resolver';
import { Key } from './key';

export class Injector {
  constructor(...modules) {
    this._modules = modules;
    this._binder = new Binder(modules);
    this._resolver = new Resolver(this._binder);
    // create binder
    // send modules to binder
    // resolve
    this._isSync = false; 
  }
  
  setSyncWhenPossible(shouldBeSync) {
    
  }

	/*
		TODO: right now only support constructor injection, maybe later to enable easier testing
		injectMembers(instance) {
	}
	*/

	/**
	 A Provider is a function that creates instances for a particular key/class
     @param key - key to retrieve a provider for should be instance of @see Key
	 */
  getProvider(key) {
    const k = (key instanceof Key) ? key : Key.fromToken(key);
    return this._resolver.getProvider(k);
  }

	/**
	 Retrieve an instance for a key, same as getProvider(key)();
	 */
  get(key) {
    return this.getProvider(key)();
  }

	/**
		Retrieves parent injector if one exists, otherwise null
  */
  getParent() {
    return this._parent;
  }
}
