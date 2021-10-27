import 'reflect-metadata';
import { Annotation, AnnotationConstructor } from './Annotation';

export class Annotations {
  static setAnnotation(annotation: Annotation, target: Object, key: string): void {
    const annotations = Reflect.getMetadata('annotations', target, key) || [];
    annotations.push(annotation);
    return Reflect.defineMetadata('annotations', annotations, target, key);
  }

  static getAnnotations(Type: AnnotationConstructor, target: Object, key: string): Array<Annotation> {
    const annotations: Array<Annotation> = Reflect.getMetadata('annotations', target, key) || [];
    const result = annotations.filter((x) => (x instanceof Type
      || (Object.getPrototypeOf(x.constructor)._name && Object.getPrototypeOf(x.constructor)._name === Type._name)));
    return result;
  }

  static hasAnnotation(AnnotationType: AnnotationConstructor, target: Object, key: string): boolean {
    return Annotations.getAnnotations(AnnotationType, target, key).length !== 0;
  }

  static getAnnotation(Type: AnnotationConstructor, target: Object, key: string): Annotation {
    const res = Annotations.getAnnotations(Type, target, key);

    if (res.length !== 1) {
      throw new Error(`There is ${res.length} annotations available of type ${Type}`);
    }

    return res[0];
  }
}
