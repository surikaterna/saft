import 'reflect-metadata';

type AnnotationKey = string | symbol;

/**
 * TODO: I think this module will need to be converted last
 */
export class Annotations {
  static setAnnotation(annotation: any, target: any, key: AnnotationKey): void {
    const annotations = Reflect.getMetadata('annotations', target, key) || [];
    annotations.push(annotation);
    return Reflect.defineMetadata('annotations', annotations, target, key);
  }

  static getAnnotations<ReturnType = any>(Type: any, target: any, key: AnnotationKey): Array<ReturnType> {
    const annotations: Array<any> = Reflect.getMetadata('annotations', target, key) || [];
    const result = annotations.filter((x) => (x instanceof Type
      || (Object.getPrototypeOf(x.constructor)._name && Object.getPrototypeOf(x.constructor)._name === Type._name)));
    return result;
  }

  static hasAnnotation(AnnotationType: any, target: any, key: AnnotationKey): boolean {
    return Annotations.getAnnotations(AnnotationType, target, key).length !== 0;
  }

  static getAnnotation<ReturnType>(Type: any, target: any, key: AnnotationKey): ReturnType {
    const res = Annotations.getAnnotations(Type, target, key);

    if (res.length !== 1) {
      throw new Error(`There is ${res.length} annotations available of type ${Type}`);
    }

    return res[0];
  }
}
