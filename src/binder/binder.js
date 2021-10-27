import Reflector from '../reflect';
import {
  Annotations, ProvidesAnnotation as Provides,
  InjectAnnotation as Inject, SingletonAnnotation as Singleton, BindingAnnotation
} from '../annotations';
import { Binding } from './Binding';

class ScopedBinder {
  constructor(binding) {
    this._binding = binding;
  }
  in(scope) {
    this._binding.setScope(scope);
  }

  // asEagerSingleton??
}

export class LinkedBinder {
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
  constructor(modules = [], parent) {
    this._bindings = new Map();
    this._modules = [];
    this._parent = parent;
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
    throw new Error('not supported');
  }

  setParent(parent) {
    this._parent = parent;
  }

  getBinding(key) {
    let binding = this._bindings.get(key);
    if (!binding && this._parent) {
      binding = this._parent.getBinding(key);
    }
    return binding;
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
      if (Annotations.hasAnnotation(BindingAnnotation, mod, k)) {
        const bindings = Annotations.getAnnotations(BindingAnnotation, mod, k);
        bindings.forEach(binding => {
          binding.bind(binder, mod, k);
        });
      }
    });
  }
}
