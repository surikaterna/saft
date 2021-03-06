import Promise from 'bluebird';

import { Binder } from './binder';
import { Resolver } from '../resolver';
import { Key } from '../key';
import { _getMultibinder } from './list_binder';

export class MapBinder extends Binder {
  static get(binder, key) {
    return _getMultibinder(binder, key, MapBinder);
  }

  constructor(binder) {
    super([], binder);
    this._resolver = new Resolver(this);
  }

  _get() {
    // could be precached...
    const result = {};
    this._bindings.forEach(binding => {
      const key = binding._key;
      result[key] = this._resolver.getProvider(Key.fromToken(key))();
    });
    return Promise.props(result);
  }
}
