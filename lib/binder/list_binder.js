import Promise from 'bluebird';

import { Binder } from './binder';
import { Resolver } from '../resolver';
import { Key } from '../key';

// pretty
export function _getMultibinder(binder, key, Multibinder) {
  if (!binder._multiBinders) {
    binder._multiBinders = {};
  }
  let multiBinder = binder._multiBinders[key];
  if (!multiBinder) {
    binder._multiBinders[key] = multiBinder = new Multibinder(binder);

    binder.bindKey(key).toProvider(() =>
      multiBinder._get(), null, true);
  }
  return multiBinder;
}


export class ListBinder extends Binder {
  static get(binder, key) {
    return _getMultibinder(binder, key, ListBinder);
  }

  constructor(binder) {
    super([], binder);
    this._list = {};
    this._resolver = new Resolver(this);
  }

  /*  toProvider(fn) {
      this._list.push(fn);
    }
  */
  _getKey(sortOrder = 100) {
    const key = `_${this._bindings.size}`;
    const list = this._list[sortOrder] || (this._list[sortOrder] = []);
    list.push(key);
    return key;
  }

  bindToList(sortOrder) {
    const key = this._getKey(sortOrder);
    return super.bindKey(key);
  }

  _getList() {
    return this._list;
  }
  _get() {
    // could be precached...
    const allItems = [];
    let keys = Object.keys(this._list);
    keys = keys.map((e) => Number.parseInt(e, 10));
    keys.sort((a, b) => a - b);
    keys.forEach(key => allItems.push(...this._list[key]));
    const promise = Promise.map(allItems, item => this._resolver.getProvider(Key.fromToken(item))());
    return promise;
  }
}
