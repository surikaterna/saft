import {
  EagerSingletonAnnotation,
  InjectAnnotation,
  PromisesAnnotation,
  ProvidesAnnotation,
  ProvidesToListAnnotation,
  ProvidesToMapAnnotation,
  SingletonAnnotation
} from '../annotations';
import { decoratorFactory } from './decoratorFactory';

export const EagerSingleton = decoratorFactory(EagerSingletonAnnotation);
export const Inject = decoratorFactory(InjectAnnotation);
export const Promises = decoratorFactory(PromisesAnnotation);
export const Provides = decoratorFactory(ProvidesAnnotation);
export const ProvidesToList = decoratorFactory(ProvidesToListAnnotation);
export const ProvidesToMap = decoratorFactory(ProvidesToMapAnnotation);
export const Singleton = decoratorFactory(SingletonAnnotation);
export { decoratorFactory };
