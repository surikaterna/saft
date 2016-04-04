import { InjectableAnnotation, InjectAnnotation, ProvidesAnnotation, Annotations } 
  from './annotations';


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
