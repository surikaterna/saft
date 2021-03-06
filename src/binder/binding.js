export class Binding {
  constructor(key, asPromise = false) {
    this._key = key;
    this._asPromise = asPromise;
  }
  setProvider(provider) {
    this._provider = provider;
  }
  getProvider() {
    return this._provider;
  }
  setAsPromise(asPromise) {
    this._asPromise = asPromise;
  }
  asPromise() {
    return this._asPromise;
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
  setScope(scope) {
    this._scope = scope;
  }
  getScope() {
    return this._scope;
  }

  _setResolved(provider) {
    this._resolved = provider;
  }
  _getResolved() {
    return this._resolved;
  }
}
