/**
 * Uses the binder to look up necessary bindings to resolve for a specific key
 */
export class Resolver {
  constructor(binder) {
    this._binder = binder;
  }

  getProvider(key) {
    const binding = this._binder.getBinding(key);
    if (!binding) {
      throw new Error(`No binding found for ${key}`);
    }
    // check for dependencies, if so resolve and then create wrapped provider which injects current deps
    return binding.getProvider();
  }
}