import { Binder } from './binder';
import { Resolver } from './resolver';
import { Key } from './Key';
import { EagerSingletonAnnotation } from './annotations/index';
import { EventEmitter2 } from 'eventemitter2';
import Promise from 'bluebird';


export class Injector extends EventEmitter2 {
  constructor(...modules) {
    super();
    this._modules = modules;
    this._binder = new Binder(modules);
    this._resolver = new Resolver(this._binder);
    // create binder
    // send modules to binder
    // resolve
    const promises = [];
    this._binder._bindings.forEach((binding) => {
      if (binding.getScope() instanceof EagerSingletonAnnotation) {
        promises.push(this.get(binding._key));
      }
    });
    Promise.all(promises).then(() => {
      this.emit('ready');
    });
    this._isSync = false;
  }

  setSyncWhenPossible(shouldBeSync) {

  }

  createChildInjector(...modules) {
    const childInjector = new Injector(...modules);
    childInjector._parent = this;
    childInjector._binder.setParent(this._binder);
    return childInjector;
  }
	/*
		TODO: right now only support constructor injection, maybe later to enable easier testing
		injectMembers(instance) {
	}
	*/

  /**
   * A Provider is a function that creates instances for a particular key/class
   * @param key - key to retrieve a provider for should be instance of @see Key
   */
  getProvider(key) {
    const k = (key instanceof Key) ? key : Key.fromToken(key);
    return this._resolver.getProvider(k);
  }

  /**
   * Retrieve an instance for a key, same as getProvider(key)();
   */
  get(key) {
    return this.getProvider(key)();
  }

  /**
   * Retrieves parent injector if one exists, otherwise null
   */
  getParent() {
    return this._parent;
  }
}
