import { InjectableAnnotation, InjectAnnotation, ProvidesAnnotation, Annotations }
  from './annotations';
import { Key } from './key';


const decoratorFactory = function decoratorFactory(AnnotationClass) {
  return function(...params) {
    return function(target, key) {
      // Create instance
      const annotation = Object.create(AnnotationClass.prototype);
      // call constructor
      AnnotationClass.apply(annotation, params);
      // store annotation on object
      Annotations.setAnnotation(annotation, target, key);
    };
  };
};

// Multibinder
// InjectProvider
export const Inject = decoratorFactory(InjectAnnotation);

export const Provides = decoratorFactory(ProvidesAnnotation);

//angularized
export const Injectable = decoratorFactory(InjectableAnnotation);

export const Provider = keyToken => {
  const key = Key.fromToken(keyToken);
  key.asProvider();
  return key;
}