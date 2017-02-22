/**
 * Subject to change
 */
export class Key {
  constructor(key) {
    this._key = key;
  }

  static fromToken(token) {
    return new Key(token);
  }
  static fromType(Type) {
    return new Key(Type);
  }

  setAsProvider(asProvider) {
    this._asProvider = asProvider;
  }

  isProvider() {
    return this._asProvider;
  }

  getRawKey() {
    return this._key;
  }
}
