import Promise from 'bluebird';
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
    let result;
    const rawKey = key.getRawKey();

    // has this provider been created and cached?
    if (this._providers.has(rawKey)) {
      result = this._providers.get(rawKey);
    } else {
      // find the binding for this key
      const binding = this._binder.getBinding(rawKey);
      if (!binding) {
        throw new Error(`No binding found for ${key}`);
      }
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
      this._providers[rawKey] = result;
    }
    return result;
  }
}
