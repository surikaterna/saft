export interface Constructable {
  new (...args: any): any;
  _name?: string;
}

export type Constructor<T extends {} = {}> = new (...args: any[]) => T;

export type Nullable<T> = T | null;
