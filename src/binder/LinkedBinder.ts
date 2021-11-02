import { Key } from '../Key';
import { Provider } from '../provider';
import { Nullable } from '../types';
import { Binding } from './Binding';
import { ScopedBinder } from './ScopedBinder';

export class LinkedBinder {
  private readonly binding: Binding;

  constructor(binding: Binding) {
    this.binding = binding;
  }

  toProvider<Value>(provider: Provider<Value>, keys?: Nullable<Array<Key>>, asPromise?: boolean): ScopedBinder {
    this.binding.setProvider(provider);

    if (keys) {
      this.binding.setDependencies(keys);
    }

    if (asPromise !== undefined) {
      this.binding.setAsPromise(asPromise);
    }

    return new ScopedBinder(this.binding);
  }
}
