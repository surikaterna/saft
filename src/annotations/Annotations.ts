import 'reflect-metadata';
import { Constructable } from '../types';

export type AnnotationKey = string | symbol;
export type Target = any;

export class Annotations {
  static setAnnotation(annotation: any, target: Target, key?: AnnotationKey): void {
    // The Reflect methods has a typing issue that a key with value undefined cannot be passed
    const annotations = (key ? Reflect.getMetadata('annotations', target, key) : Reflect.getMetadata('annotations', target)) || [];
    annotations.push(annotation);
    return key ? Reflect.defineMetadata('annotations', annotations, target, key) : Reflect.defineMetadata('annotations', annotations, target);
  }

  static getAnnotations<Type extends Constructable>(AnnotationType: Type, target: Target, key?: AnnotationKey): Array<InstanceType<Type>> {
    const annotations: Array<any> = (key ? Reflect.getMetadata('annotations', target, key) : Reflect.getMetadata('annotations', target)) || [];
    const result: Array<InstanceType<Type>> = annotations.filter(
      (x) => x instanceof AnnotationType || (Object.getPrototypeOf(x.constructor)._name && Object.getPrototypeOf(x.constructor)._name === AnnotationType._name)
    );
    return result;
  }

  static hasAnnotation<Type extends Constructable>(AnnotationType: Type, target: Target, key?: AnnotationKey): boolean {
    return Annotations.getAnnotations(AnnotationType, target, key).length !== 0;
  }

  static getAnnotation<Type extends Constructable>(AnnotationType: Type, target: Target, key?: AnnotationKey): InstanceType<Type> {
    const res = Annotations.getAnnotations(AnnotationType, target, key);

    if (res.length !== 1) {
      throw new Error(`There is ${res.length} annotations available of type ${AnnotationType}`);
    }

    return res[0];
  }
}
