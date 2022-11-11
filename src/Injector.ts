import { EventEmitter2 } from 'eventemitter2';
import { SingletonAnnotation } from './annotations';
import { Binder, Module } from './binder';
import { Key } from './Key';
import { Provider } from './provider';
import { Resolver } from './resolver';

const isObject = (p: unknown): p is Object => {
  return typeof p === 'object';
};

const isPromise = (p: unknown): boolean => {
  return isObject(p) && 'then' in p && 'catch' in p;
};

export class Injector extends EventEmitter2 {
  _modules: Array<Module>;
  _binder: Binder;
  _resolver: Resolver;
  _parent?: Injector;

  constructor(...modules: Array<Module>) {
    super();

    this._modules = modules;
    this._binder = new Binder(modules);
    this._resolver = new Resolver(this._binder);

    const promises: Array<Promise<Array<Key>>> = [];
    this._binder._bindings.forEach((binding) => {
      const scope = binding.getScope();
      const key = binding.getKey();
      if (scope instanceof SingletonAnnotation) {
        const value = this.get(key);
        if (isPromise(value)) {
          value.then((res: Key) => {
            scope.addInstance(key, res);
          });
        }
        promises.push(value);
      }
    });

    Promise.all(promises).then(() => {
      this.emit('ready');
    });
  }

  createChildInjector(...modules: Array<Module>) {
    const childInjector = new Injector(...modules);
    childInjector._parent = this;
    childInjector._binder.setParent(this._binder);
    return childInjector;
  }

  /**
   * A Provider is a function that creates instances for a particular key/class
   * @param key - key to retrieve a provider for should be instance of @see Key
   */
  getProvider<Type>(key: Key | string): Provider<Type> {
    const k = key instanceof Key ? key : Key.fromToken(key);
    return this._resolver.getProvider(k);
  }

  /**
   * Retrieve an instance for a key, same as getProvider(key)();
   */
  get<Type = any>(key: Key | string): Type {
    return this.getProvider<Type>(key)();
  }

  /**
   * Retrieves parent injector if one exists, otherwise undefined
   */
  getParent() {
    return this._parent;
  }
}
