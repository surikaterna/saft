import Promise from 'bluebird';
import { Key } from '../Key';
import { Binder } from './Binder';
import { getMultiBinder } from './getMultiBinder';
import { MultiBinder } from './MultiBinder';

export class MapBinder extends MultiBinder {
  static get(binder: Binder, key: string): MapBinder {
    return getMultiBinder(binder, key, MapBinder) as MapBinder;
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
