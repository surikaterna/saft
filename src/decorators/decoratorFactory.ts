import { AnnotationKey, Annotations, Target } from '../annotations';
import { AnnotationConstructor } from '../annotations/Annotation';

export function decoratorFactory<Type>(AnnotationType: AnnotationConstructor<Type>) {
  return (...params: Array<any>) =>
    (target: Target, key: AnnotationKey) => {
      const annotation: Type = Object.create(AnnotationType.prototype);
      AnnotationType.apply<Type, Array<any>>(annotation, params);
      Annotations.setAnnotation(annotation, target, key);
    };
};
