import { Annotations, BindingAnnotation } from '../annotations';
import { Key } from '../Key';
import Reflector from '../reflect';
import { Binding } from './Binding';
import { LinkedBinder } from './LinkedBinder';

// TODO: Find proper type
type Module = any;

export class Binder {
  _bindings = new Map<Key, Binding>();
  _modules: Array<Module> = [];
  _parent?: Binder;

  constructor(modules = [], parent?: Binder) {

    this._parent = parent;
    modules.forEach(m => this.install(m));
  }

  bindKey(key: Key): LinkedBinder {
    const binding = new Binding(key);
    this._bindings.set(key, binding);

    return new LinkedBinder(binding);
  }

  bind(_class: any) {
    throw new Error('"bind" is not supported');
  }

  setParent(parent: Binder) {
    this._parent = parent;
  }

  getBinding(key: Key): Binding | undefined {
    let binding = this._bindings.get(key);

    if (!binding && this._parent) {
      binding = this._parent.getBinding(key);
    }

    return binding;
  }

  install(module: Module): void {
    if (this._modules.indexOf(module) !== -1) {
      return;
    }

    if (Reflector.hasFunction(module.configure)) {
      module.configure(this);
    }

    this._scanForAnnotations(module);
  }

  _scanForAnnotations(module: Module) {
    const binder = this;
    Reflector.ownKeys(Object.getPrototypeOf(module)).forEach((annotationKey) => {
      if (Annotations.hasAnnotation(BindingAnnotation, module, annotationKey)) {
        const bindings = Annotations.getAnnotations(BindingAnnotation, module, annotationKey);
        bindings.forEach(binding => {
          binding.bind(binder, module, annotationKey);
        });
      }
    });
  }
}
