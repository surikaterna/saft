import { Key } from '../Key';
import { Provider } from '../provider';
import { Binding } from './Binding';

export interface Scope {
  scope(key: Key, unscopedProvider: Provider): Provider;
}

export class ScopedBinder {
  private binding: Binding;

  constructor(binding: Binding) {
    this.binding = binding;
  }

  in(scope?: Scope): void {
    this.binding.setScope(scope);
  }
}
