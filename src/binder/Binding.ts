import { Key } from '../Key';

// TODO: Import from `decorators` when converted
export interface Provider {
  (keyToken: string): Key;
}

export interface Scope {
  scope(key: Key, provider: Provider): Provider;
}

export class Binding {
  // TODO: Update so it does not need to be public
  public _key: Key;
  protected isPromise: boolean;
  protected provider?: Provider;
  protected scope?: Scope;
  protected resolved?: Provider;
  protected dependencies?: Array<Key>;

  constructor(key: Key, asPromise = false) {
    this._key = key;
    this.isPromise = asPromise;
  }

  setProvider(provider: Provider): void {
    this.provider = provider;
  }

  getProvider(): Binding['provider'] {
    return this.provider;
  }

  setAsPromise(asPromise: boolean): void {
    this.isPromise = asPromise;
  }

  asPromise(): boolean {
    return this.isPromise;
  }

  setDependencies(keys: Array<Key>): void {
    this.dependencies = keys;
  }

  hasDependencies(): boolean {
    return this.dependencies !== undefined && this.dependencies.length > 0;
  }

  getDependencies(): Binding['dependencies'] {
    return this.dependencies;
  }

  setScope(scope: Scope): void {
    this.scope = scope;
  }

  getScope(): Binding['scope'] {
    return this.scope;
  }

  _setResolved(provider: Provider): void {
    this.resolved = provider;
  }

  _getResolved(): Binding['resolved'] {
    return this.resolved;
  }
}
