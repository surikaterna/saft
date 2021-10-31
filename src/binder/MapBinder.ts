import Promise from 'bluebird';
import { Key } from '../Key';
import { Binder } from './Binder';
import { getMultiBinder } from './getMultiBinder';
import { MultiBinder } from './MultiBinder';

export class MapBinder extends MultiBinder {
  static get(binder: Binder, key: string) {
    return getMultiBinder(binder, key, MapBinder);
  }

  constructor(binder: Binder) {
    super(binder);
  }

  _get(): Promise<Record<string, Key>> {
    const result: Record<string, Promise<Key>> = {};

    this._bindings.forEach(binding => {
      const key = binding._key;
      result[key] = this._resolver.getProvider(Key.fromToken(key))();
    });

    return Promise.props(result);
  }
}
