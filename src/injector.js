import { Binder } from './binder/binder';
import { Resolver } from './resolver';
import { Key } from './key';
import { EagerSingletonAnnotation } from './annotations/index';

export class Injector {
  constructor(...modules) {
    this._modules = modules;
    this._binder = new Binder(modules);
    this._resolver = new Resolver(this._binder);
    // create binder
    // send modules to binder
    // resolve
    this._binder._bindings.forEach((binding) => {
      if (binding.getScope() instanceof EagerSingletonAnnotation) {
        this.get(binding._key);
      }
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
