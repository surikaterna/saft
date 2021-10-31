import 'reflect-metadata';
import { AnnotationConstructor } from './Annotation';

export type AnnotationKey = string | symbol;
export type Target = any;

/**
 * TODO: I think this module will need to be converted last
 */
export class Annotations {
  static setAnnotation(annotation: any, target: Target, key: AnnotationKey): void {
    const annotations = Reflect.getMetadata('annotations', target, key) || [];
    annotations.push(annotation);
    return Reflect.defineMetadata('annotations', annotations, target, key);
  }

  static getAnnotations<Type>(AnnotationType: AnnotationConstructor<Type>, target: Target, key: AnnotationKey): Array<Type> {
    const annotations: Array<any> = Reflect.getMetadata('annotations', target, key) || [];
    const result = annotations.filter((x) => (x instanceof AnnotationType
      || (Object.getPrototypeOf(x.constructor)._name && Object.getPrototypeOf(x.constructor)._name === AnnotationType._name)));
    return result;
  }

  static hasAnnotation<Type>(AnnotationType: AnnotationConstructor<Type>, target: Target, key: AnnotationKey): boolean {
    return Annotations.getAnnotations(AnnotationType, target, key).length !== 0;
  }

  static getAnnotation<Type>(AnnotationType: AnnotationConstructor<Type>, target: Target, key: AnnotationKey): Type {
    const res = Annotations.getAnnotations(AnnotationType, target, key);

    if (res.length !== 1) {
      throw new Error(`There is ${res.length} annotations available of type ${AnnotationType}`);
    }

    return res[0];
  }
}
