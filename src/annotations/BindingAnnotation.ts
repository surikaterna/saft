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

  bind(_target: any, _targetKey: string, _binder: Binder) {
    throw new Error('Binding needs to override bind()');
  }
}
