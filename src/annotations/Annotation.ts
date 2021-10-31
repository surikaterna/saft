export type AnnotationConstructor<Type extends Object> = ObjectConstructor & {
  new(...params: any[]): Type;
  _name: string;
};

export abstract class Annotation {
  public static _name: string;
}
