import { Provider } from '../decorators/Provider';
import { Key } from '../Key';
import { Binding } from './Binding';
import { ScopedBinder } from './ScopedBinder';

export class LinkedBinder {
  // TODO: Update so it does not need to be public
  public _binding: Binding;

  constructor(binding: Binding) {
    this._binding = binding;
  }

  toProvider(provider: Provider, keys: Array<Key>, asPromise: boolean): ScopedBinder {
    this._binding.setProvider(provider);

    if (keys) {
      this._binding.setDependencies(keys);
    }

    this._binding.setAsPromise(asPromise);
    return new ScopedBinder(this._binding);
  }
}
