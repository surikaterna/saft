import Promise from 'bluebird';
import { Key } from '../Key';
import { Resolver } from '../resolver';
import { Binder } from './Binder';

export abstract class MultiBinder extends Binder {
  protected _resolver: Resolver = new Resolver(this);

  protected constructor(binder: Binder) {
    super([], binder);
  }

  abstract _get(): Promise<Array<Key>> | Promise<Record<string, Key>>;
}
