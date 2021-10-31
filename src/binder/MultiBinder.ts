import Promise from 'bluebird';
import { Provider } from '../provider';
import { Resolver } from '../resolver';
import { Binder } from './Binder';

export abstract class MultiBinder extends Binder {
  protected _resolver: Resolver = new Resolver(this);

  protected constructor(binder: Binder) {
    super([], binder);
  }

  abstract _get(): Promise<Array<string> | Record<string, Provider>>;
}
