/**
 * Uses the binder to look up necessary bindings to resolve for a specific key
 */
export class Resolver {
  constructor(binder) {
    this._binder = binder;
    this._providers = new Map();
  }

  /**
   * Walks the dependency tree and creates a provider function that can instansiate the object
   */
  getProvider(key) {

    // has this provider been created and cached?
    if (this._providers.has(key)) {
      return this._providers.get(key);
    } else {
      // find the binding for this key
      const binding = this._binder.getBinding(key);
      if (!binding) {
        throw new Error(`No binding found for ${key}`);
      }
      let provider = null;
      // check for dependencies, if so resolve and then create wrapped provider which injects current deps
      if (binding.hasDependencies()) {
        // get dep keys
        const deps = binding.getDependencies();
        // get providers for deps
        const depProviders = deps.map(dep => {
          return this.getProvider(dep);
        });
        provider = function() {
          // resolve instance for each
          const params = depProviders.map(prov => {
            return prov();
          });
          return binding._provider.apply(null, params);
        };
      } else {
        provider = binding.getProvider();
      }
      /*      return function() {
              return 'TEST';
            }*/
      return provider;
      //return binding.getProvider();
    }
  }
}
