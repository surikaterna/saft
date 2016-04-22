export class Key {
  static fromToken(token) {
    return new Key(token);
  }
  static fromType(Type) {
    return new Key(Type);
  }

  asProvider() {
    this._asProvider = true;
  }
}

