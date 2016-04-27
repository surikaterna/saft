import Reflector from '../reflect';
import { Annotations, ProvidesAnnotation as Provides,
  InjectAnnotation as Inject, SingletonAnnotation as Singleton } from '../annotations';
import { Binding } from './binding';

class ScopedBinder {
  constructor(binding) {
    this._binding = binding;
  }
  in(scope) {
    this._binding.setScope(scope);
  }

  // asEagerSingleton??
}

class LinkedBinder {
  constructor(binding) {
    this._binding = binding;
  }
  toProvider(provider, keys, asPromise) {
    this._binding.setProvider(provider);
    if (keys) {
      this._binding.setDependencies(keys);
    }
    this._binding.setAsPromise(asPromise);
    return new ScopedBinder(this._binding);
  }
}

export class Binder {
  constructor(modules) {
    this._bindings = new Map();
    this._modules = [];
    modules.forEach(m => {
      this.install(m);
    });
  }

  bindKey(key) {
    const binding = new Binding(key);
    this._bindings.set(key, binding);
    return new LinkedBinder(binding);
  }

  bind(clss) {

  }

  getBinding(key) {
    return this._bindings.get(key);
  }
  /*  getProvider(key) {
      throw new Error('Unable to find provider for ' + key);
    }
  */

  install(mod) {
    if (!this._modules.indexOf(mod) !== -1) {
      if (Reflector.hasFunction(mod.configure)) {
        mod.configure(this);
      }
      this._scanForAnnotations(mod);
    }
  }
  _scanForAnnotations(mod) {
    const binder = this;
    Reflector.ownKeys(Object.getPrototypeOf(mod)).forEach(k => {
      if (Annotations.hasAnnotation(Provides, mod, k)) {
        const provides = Annotations.getAnnotations(Provides, mod, k);
        const fn = mod[k];
        let scope;
        if (Annotations.hasAnnotation(Singleton, mod, k)) {
          scope = Annotations.getAnnotation(Singleton, mod, k);
        }
        if (fn.length !== 0) {
          if (!Annotations.hasAnnotation(Inject, mod, k)) {
            throw new Error('@Provides function has unsatisfied parameters, @Inject is missing',
              mod, k);
          } else {
            // we have a provides function which should have things injected
            const inject = Annotations.getAnnotation(Inject, mod, k);
            if (inject.getKeys().length !== fn.length) {
              throw new Error(`@Provides function has unsatisfied parameters, @Inject specifies
                 ${inject.getKeys().length} keys and function expects ${fn.length} parameters`);
            }
            provides.forEach(provide => {
              const key = provide.key;
              binder.bindKey(key)
                .toProvider(fn.bind(mod), inject.getKeys(), provide.asPromise).in(scope);
            });
          }
        } else {
          provides.forEach(provide => {
            const key = provide.key;
            binder.bindKey(key).toProvider(fn.bind(mod), null, provide.asPromise).in(scope);
          });
        }
      }
    });
  }
}
