import { Binder } from '.';
import { Constructor } from '../types';
import { MultiBinder } from './MultiBinder';

export function getMultiBinder(binder: Binder, key: string, MultiBinderConstructor: Constructor<MultiBinder>) {
  if (!binder._multiBinders) {
    binder._multiBinders = {};
  }

  let multiBinder = binder._multiBinders[key];

  if (!multiBinder) {
    binder._multiBinders[key] = multiBinder = new MultiBinderConstructor(binder);

    const provider = () => multiBinder._get();
    binder.bindKey(key).toProvider(provider, null, true);
  }

  return multiBinder;
}
