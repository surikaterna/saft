import { Key } from '../Key';

export class InjectAnnotation {
  public static _name = 'InjectAnnotation';
  private readonly keys: Array<Key>;

  constructor(...keys: Array<Key | string>) {
    this.keys = keys.map((k) => k instanceof Key ? k : Key.fromToken(k));
  }

  getKeys(): InjectAnnotation['keys'] {
    return this.keys;
  }
}
