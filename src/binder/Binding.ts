import { Provider } from '../provider';

export interface Scope {
  scope(key: string, provider: Provider): Provider;
}

export class Binding {
  // TODO: Update so it does not need to be public
  public _key: string;
  protected isPromise: boolean;
  protected provider?: Provider;
  protected scope?: Scope;
  protected resolved?: Provider;
  protected dependencies?: Array<string>;

  constructor(key: string, asPromise = false) {
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

  setDependencies(keys: Array<string>): void {
    this.dependencies = keys;
  }

  hasDependencies(): boolean {
    return this.dependencies !== undefined && this.dependencies.length > 0;
  }

  getDependencies(): Binding['dependencies'] {
    return this.dependencies;
  }

  setScope(scope?: Scope): void {
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
