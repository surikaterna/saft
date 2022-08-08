import { Key } from '../Key';

export interface Provider<ReturnValue extends any = any> {
  (...params: any[]): ReturnValue;
}

export function Provider(keyToken: string): Key {
  const key = Key.fromToken(keyToken);
  key.setAsProvider(true);

  return key;
}
