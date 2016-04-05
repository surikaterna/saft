export class Binding {
  constructor(key) {
    this._key = key;
  }
  setProvider(provider) {
    this._provider = provider;
  }
  getProvider() {
    return this._provider;
  }
  setDependencies(keys) {
    this._dependencies = keys;
  }
  hasDependencies() {
    return this._dependencies !== undefined && this._dependencies.length > 0;
  }
  getDependencies() {
    return this._dependencies;
  }
}

