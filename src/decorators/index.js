import {
  Annotations,
  EagerSingletonAnnotation,
  InjectAnnotation,
  PromisesAnnotation,
  ProvidesAnnotation,
  ProvidesToListAnnotation,
  ProvidesToMapAnnotation,
  SingletonAnnotation
} from '../annotations';

const decoratorFactory = function decoratorFactory(AnnotationClass) {
  return (...params) => (target, key) => {
    // Create instance
    const annotation = Object.create(AnnotationClass.prototype);
    // call constructor
    AnnotationClass.apply(annotation, params);
    // store annotation on object
    Annotations.setAnnotation(annotation, target, key);
  };
};

// Multibinder
export const Inject = decoratorFactory(InjectAnnotation);

export const Provides = decoratorFactory(ProvidesAnnotation);

export const Promises = decoratorFactory(PromisesAnnotation);

export const Singleton = decoratorFactory(SingletonAnnotation);

export const EagerSingleton = decoratorFactory(EagerSingletonAnnotation);

export const ProvidesToList = decoratorFactory(ProvidesToListAnnotation);
export const ProvidesToMap = decoratorFactory(ProvidesToMapAnnotation);

// TODO: Remove export from decorators?
export * from '../provider/Provider';
