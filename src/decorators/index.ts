import {
  AnnotationConstructor,
  EagerSingletonAnnotation,
  InjectAnnotation,
  PromisesAnnotation,
  ProvidesAnnotation,
  ProvidesToListAnnotation,
  ProvidesToMapAnnotation,
  SingletonAnnotation
} from '../annotations';
import { decoratorFactory } from './decoratorFactory';

export const EagerSingleton = decoratorFactory(EagerSingletonAnnotation as AnnotationConstructor<EagerSingletonAnnotation>);
export const Inject = decoratorFactory(InjectAnnotation as AnnotationConstructor<InjectAnnotation>);
export const Promises = decoratorFactory(PromisesAnnotation as AnnotationConstructor<PromisesAnnotation>);
export const Provides = decoratorFactory(ProvidesAnnotation as AnnotationConstructor<ProvidesAnnotation>);
export const ProvidesToList = decoratorFactory(ProvidesToListAnnotation as AnnotationConstructor<ProvidesToListAnnotation>);
export const ProvidesToMap = decoratorFactory(ProvidesToMapAnnotation as AnnotationConstructor<ProvidesToMapAnnotation>);
export const Singleton = decoratorFactory(SingletonAnnotation as AnnotationConstructor<SingletonAnnotation>);
export { decoratorFactory };
