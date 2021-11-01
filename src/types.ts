export interface Constructable {
  new (...args: any): any;
  _name?: string;
}

export type Nullable<T> = T | null;
