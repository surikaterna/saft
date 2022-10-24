import { Scope } from '../binder';
import { Key } from '../Key';
import { Provider } from '../provider';

export class SingletonAnnotation implements Scope {
  public static _name = 'SingletonAnnotation';
  private instances: Record<string, Promise<Key> | Key> = {};

  scope(key: Key, unscopedProvider: Provider): Provider {
    return () => {
      const rawKey = key.getRawKey();
      let instance = this.instances[rawKey];
      if (this.instances[rawKey] === undefined) {
        instance = this.instances[rawKey] = unscopedProvider();
      }
      return instance;
    };
  }

  addInstance(key: string, instance: Key): void {
    this.instances[key] = instance;
  }
}
