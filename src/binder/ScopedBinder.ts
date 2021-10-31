import { Key } from '../Key';
import { Provider } from '../provider';
import { Binding } from './Binding';

export interface Scope {
  scope(key: Key, unscopedProvider: Provider): Provider;
}

export class ScopedBinder {
  // TODO: Update so it does not need to be public
  public _binding: Binding;

  constructor(binding: Binding) {
    this._binding = binding;
  }

  in(scope?: Scope): void {
    this._binding.setScope(scope);
  }
}
