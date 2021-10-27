export type AnnotationConstructor = ObjectConstructor & { _name: string; };

export abstract class Annotation {
  public static _name: string;
}
