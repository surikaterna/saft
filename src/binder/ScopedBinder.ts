import { Binding, Scope } from './Binding';

export class ScopedBinder {
  // TODO: Update so it does not need to be public
  public _binding: Binding;

  constructor(binding: Binding) {
    this._binding = binding;
  }

  in(scope: Scope): void {
    this._binding.setScope(scope);
  }
}
