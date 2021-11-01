import { AnnotationKey, Annotations, Target } from '../annotations';
import { Constructable } from '../types';

export function decoratorFactory<Type extends Constructable>(AnnotationType: Type) {
  return (...params: ConstructorParameters<Type>) =>
    (target: Target, key: AnnotationKey) => {
      const annotation = Object.create(AnnotationType.prototype);
      AnnotationType.apply(annotation, params);
      Annotations.setAnnotation(annotation, target, key);
    };
}
