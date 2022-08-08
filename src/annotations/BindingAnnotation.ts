import { AnnotationKey, Target } from '../annotations/Annotations';
import { Binder } from '../binder';

export class BindingAnnotation {
  public static _name = 'BindingAnnotation';
  protected readonly _key: string;
  protected readonly _asPromise: boolean;

  constructor(key: string, asPromise = false) {
    this._key = key;
    this._asPromise = asPromise;
  }

  get key() {
    return this._key;
  }

  get asPromise() {
    return this._asPromise;
  }

  bind(_binder: Binder, _target: Target, _targetKey: AnnotationKey) {
    throw new Error('Binding needs to override bind()');
  }
}
