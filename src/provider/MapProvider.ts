import { Key } from '../Key';

export interface Provider {
  (keyToken: string): Key;
}

export function Provider(keyToken: string): Key {
  const key = Key.fromToken(keyToken);
  key.setAsProvider(true);

  return key;
}
