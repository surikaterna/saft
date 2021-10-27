/**
 * Subject to change
 */
export class Key {
  private asProvider: boolean;
  private readonly key: string;

  constructor(key: string) {
    this.key = key;
    this.asProvider = false;
  }

  static fromToken(token: string): Key {
    return new Key(token);
  }

  setAsProvider(asProvider: boolean) {
    this.asProvider = asProvider;
  }

  isProvider(): boolean {
    return this.asProvider;
  }

  getRawKey(): string {
    return this.key;
  }

  toString(): string {
    return `Key<${this.key}>`;
  }
}
