import Reflector from '../reflect';
import { Annotations, ProvidesAnnotation as Provides } from '../annotations';

class LinkedBinder {
  toProvider(provider) {
    console.log("PROV", arguments)
  }
}

export class Binder {
  constructor(modules) {
    this._modules = [];
    modules.forEach(m => {
      this.install(m);
    });
  }

  bindKey(key) {
    return new LinkedBinder(this);
  }

  bind(clss) {

  }

  getProvider(key) {
    throw new Error('Unable to find provider for ' + key);
  }

  install(mod) {
    if (!this._modules.indexOf(mod) !== -1) {
      if (Reflector.hasFunction(mod.configure)) {
        mod.configure(this);
      }
      this._scanForAnnotations(mod);
    }
  }
  _scanForAnnotations(mod) {
    let binder = this;
    Reflector.ownKeys(Object.getPrototypeOf(mod)).forEach(k => {
      if (Annotations.hasAnnotation(Provides, mod, k)) {
        const provides = Annotations.getAnnotations(Provides, mod, k);
        const fn = mod[k];
        if (fn.length !== 0) {
          throw new Error('@Provides function cannot have arguments (yet)');
        } else {
          provides.forEach(provide => {
            const t = provide.key;
            binder.bindKey(t).toProvider(fn);
          });
        }
      }
    });
  }
}
