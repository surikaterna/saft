import Reflector from '../reflect';
import { Annotations, ProvidesAnnotation as Provides } from '../annotations';

export class Binder {
  constructor(modules) {
    this._modules = [];
    modules.forEach(m => {
      this.install(m);
    });
  }

  bindKey(key) {
    //return new LinkedBinder();
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
    Reflector.ownKeys(Object.getPrototypeOf(mod)).forEach(k => {
      if (Annotations.hasAnnotation(k, Provides)) {
        let provides = Annotations.getAnnotation(k, Provides);
        if (k.length !== 0) {
          throw new Error('@Provides method cannot have arguments');
        } else {
          var t = provides.providesType();
          bind(t).toProvider(k.bind(mod));
        }
      }
    });
  }
}

