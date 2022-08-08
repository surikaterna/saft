import Promise from 'bluebird';
import { Key } from '../Key';
import { Binder } from './Binder';
import { getMultiBinder } from './getMultiBinder';
import { MultiBinder } from './MultiBinder';

type BoundList = Record<number, Array<string>>;

export class ListBinder extends MultiBinder {
  _list: BoundList = {};

  static get(binder: Binder, key: string): ListBinder {
    return getMultiBinder(binder, key, ListBinder) as ListBinder;
  }

  constructor(binder: Binder) {
    super(binder);
  }

  bindToList(sortOrder?: number) {
    const key = this._getKey(sortOrder);
    return super.bindKey(key);
  }

  _get(): Promise<Array<Key>> {
    const allItems: Array<any> = [];

    const keys = Object.keys(this._list).map((e) => Number.parseInt(e, 10));
    keys.sort((a, b) => a - b);
    keys.forEach(key => allItems.push(...this._list[key]));

    return Promise.map(allItems, (item) => {
      const key = Key.fromToken(item);
      const provider = this._resolver.getProvider(key);
      return provider();
    });
  }

  _getKey(sortOrder = 100): string {
    const key = `_${this._bindings.size}`;
    const list = this._list[sortOrder] || (this._list[sortOrder] = []);
    list.push(key);
    return key;
  }
}
