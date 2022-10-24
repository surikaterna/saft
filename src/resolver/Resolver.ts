import Promise from 'bluebird';
import { Binder, Binding } from '../binder';
import { Key } from '../Key';
import { Provider } from '../provider';

export class Resolver {
  private _binder: Binder;

  constructor(binder: Binder) {
    this._binder = binder;
  }

  getProvider(key: Key): Provider {
    const rawKey = key.getRawKey();
    const binding = this._binder.getBinding(rawKey);

    if (!binding) {
      throw new Error(`No binding found for ${key}`);
    }

    return binding._getResolved() ?? this.findBinding(key, binding);
  }

  private findBinding(key: Key, binding: Binding): Provider {
    const provider = binding.hasDependencies()
      ? this.getProviderWithDependencies(binding)
      : binding.getProvider();

    if (!provider) {
      throw new Error(`Unable to get a Provider for binding of ${key}`);
    }

    const scope = binding.getScope();
    const scopedProvider = scope
      ? scope.scope(key, provider)
      : provider;

    binding._setResolved(scopedProvider);
    return scopedProvider;
  }

  private getProviderWithDependencies(binding: Binding) {
    const dependencies = binding.getDependencies();

    if (!dependencies) {
      return binding.getProvider();
    }

    const dependencyProviders = dependencies.map(dep => this.getProvider(dep));
    const dependencyBindings = dependencies.map(dep => this._binder.getBinding(dep.getRawKey()));
    const params = dependencyProviders.map(this.createGetProviderParams(dependencies));
    const hasPromise = dependencyBindings.some(this.checkBindingHasPromise);

    if (hasPromise) {
      binding.setAsPromise(true);
    }

    return this.createProvider(binding, params, hasPromise);
  }

  private checkBindingHasPromise = (binding?: Binding): boolean => binding?.asPromise() ?? false;

  private createProvider = (
    binding: Binding,
    params: Array<Provider>,
    hasPromise: boolean
  ) => () =>
      hasPromise
        ? Promise.all(params).then((resolvedParams) => this.applyToProvider(binding, resolvedParams))
        : this.applyToProvider(binding, params);

  private createGetProviderParams = (dependencies: Array<Key>) => (provider: Provider, index: number) => dependencies[index]?.isProvider()
    ? provider
    : (provider() as unknown as Provider);

  private applyToProvider = (binding: Binding, params: Array<any>) => {
    const provider = binding.getProvider();

    if (!provider) {
      const key = Key.fromToken(binding.getKey());
      throw new Error(`Unable to get Provider for binding of ${key}`);
    }

    return provider.apply(null, params);
  };
}
