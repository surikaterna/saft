import Promise from 'bluebird';
import { Key } from '../Key';

export interface Provider {
  (...params: any[]): Promise<Key>;
}

export function Provider(keyToken: string): Key {
  const key = Key.fromToken(keyToken);
  key.setAsProvider(true);

  return key;
}
