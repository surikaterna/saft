import { AnnotationKey, Annotations, Target } from '../annotations';

interface Constructable {
  new (...args: any): any;
}

export function decoratorFactory<Type extends Constructable>(AnnotationType: Type) {
  return (...params: ConstructorParameters<Type>) =>
    (target: Target, key: AnnotationKey) => {
      const annotation = Object.create(AnnotationType.prototype);
      AnnotationType.apply(annotation, params);
      Annotations.setAnnotation(annotation, target, key);
    };
}
