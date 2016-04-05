export class Binding {
  constructor(key, provider, scope, dependencyKeys) {
    this._key = key;
    this._provider = provider;
    this._dependencyKeys = dependencyKeys;
    this._scope = scope;
  }
}

