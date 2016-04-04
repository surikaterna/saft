import { Binder } from './internal/binder';

export class Injector {
  constructor(...modules) {
    this._modules = modules;
    this._binder = new Binder(modules);
    // create binder
    // send modules to binder
    // resolve
    /*		modules.forEach((e)=> {
          console.log(e);
    //			console.log(Reflect.ownKeys(e.constructor.prototype));
          console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(e)));
        });
    */
  }

	/*
		TODO: right now only support constructor injection
		injectMembers(instance) {
	}
	*/

	/**
	 A Provider is a function that creates instances for a particular key/class
     @param
	 */
  getProvider(key) {
    return this._binder.getProvider(key);
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
