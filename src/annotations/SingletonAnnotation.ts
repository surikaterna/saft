import Promise from 'bluebird';
import { Scope } from '../binder';
import { Key } from '../Key';
import { Provider } from '../provider';

export class SingletonAnnotation implements Scope {
  public static _name = 'SingletonAnnotation';

  scope(key: Key, unscopedProvider: Provider): Provider {
    const instances: Record<string, Promise<Key>> = {};
    return () => {
      const rawKey = key.getRawKey();
      let instance = instances[rawKey];
      if (instances[rawKey] === undefined) {
        instance = instances[rawKey] = unscopedProvider();
      }
      return instance;
    };
  }
}
