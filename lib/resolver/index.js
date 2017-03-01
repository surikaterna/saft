import Promise from 'bluebird';
/**
 * Uses the binder to look up necessary bindings to resolve for a specific key
 */
export class Resolver {
  constructor(binder) {
    this._binder = binder;
  }

  /**
   * Walks the dependency tree and creates a provider function that can instansiate the object
   */
  getProvider(key) {
    const rawKey = key.getRawKey();
    const binding = this._binder.getBinding(rawKey);
    if (!binding) {
      throw new Error(`No binding found for ${key}`);
    }
    let result = binding._getResolved();
    // has this provider been created and cached?
    if (!result) {
      // find the binding for this key
      let provider = null;
      // check for dependencies, if so resolve and then create wrapped
      // provider which injects current deps
      if (binding.hasDependencies()) {
        // get dep keys
        const deps = binding.getDependencies();
        // get providers for deps
        const depProviders = deps.map(dep => this.getProvider(dep));
        const depBindings = deps.map(dep => this._binder.getBinding(dep.getRawKey()));
        let hasPromise = false;
        depBindings.forEach(d => {
          if (d.asPromise()) {
            hasPromise = true;
          }
        });
        if (hasPromise) {
          binding.setAsPromise(true);
        }
        provider = () => {
          // resolve instance for each
          const params = [];
          depProviders.forEach((prov, i) => {
            if (deps[i].isProvider()) {
              params.push(prov);
            } else {
              params.push(prov());
            }
          });
          let val;
          if (hasPromise) {
            val = Promise.all(params).then(resolvedParams =>
              binding.getProvider().apply(null, resolvedParams));
          } else {
            val = binding.getProvider().apply(null, params);
          }
          return val;
        };
      } else {
        provider = binding.getProvider();
      }
      result = provider;
      if (binding.getScope()) {
        result = binding.getScope().scope(key, result);
      }
      binding._setResolved(result);
    }
    return result;
  }
}
