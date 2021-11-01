import { Annotations, BindingAnnotation } from '../annotations';
import Reflector from '../reflect';
import { Binding } from './Binding';
import { LinkedBinder } from './LinkedBinder';
import { MultiBinder } from './MultiBinder';

// TODO: Find proper type
export type Module = any;

export class Binder {
  _bindings = new Map<string, Binding>();
  _modules: Array<Module> = [];
  _multiBinders?: Record<string, MultiBinder>;
  _parent?: Binder;

  constructor(modules: Array<Module> = [], parent?: Binder) {
    this._parent = parent;
    modules.forEach((m) => this.install(m));
  }

  bindKey(key: string): LinkedBinder {
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

  getBinding(key: string): Binding | undefined {
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
        bindings.forEach((binding) => {
          binding.bind(binder, module, annotationKey);
        });
      }
    });
  }
}
