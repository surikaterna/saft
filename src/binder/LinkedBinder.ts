import { Key } from '../Key';
import { Provider } from '../provider';
import { Nullable } from '../types';
import { Binding } from './Binding';
import { ScopedBinder } from './ScopedBinder';

export class LinkedBinder {
  // TODO: Update so it does not need to be public
  public _binding: Binding;

  constructor(binding: Binding) {
    this._binding = binding;
  }

  toProvider(provider: Provider, keys?: Nullable<Array<Key>>, asPromise?: boolean): ScopedBinder {
    this._binding.setProvider(provider);

    if (keys) {
      this._binding.setDependencies(keys);
    }

    if (asPromise !== undefined) {
      this._binding.setAsPromise(asPromise);
    }

    return new ScopedBinder(this._binding);
  }
}
