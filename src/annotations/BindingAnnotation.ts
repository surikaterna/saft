import { AnnotationKey, Target } from '../annotations/Annotations';
import { Binder } from '../binder';
import { Key } from '../Key';

export class BindingAnnotation {
  public static _name = 'BindingAnnotation';
  private readonly _key: Key;
  private readonly _asPromise: boolean;

  constructor(key: Key, asPromise = false) {
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
