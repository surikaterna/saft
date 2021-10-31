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

// Multibinder
export const Inject = decoratorFactory(InjectAnnotation);
export const Provides = decoratorFactory(ProvidesAnnotation);
export const Promises = decoratorFactory(PromisesAnnotation);
export const Singleton = decoratorFactory(SingletonAnnotation);
export const EagerSingleton = decoratorFactory(EagerSingletonAnnotation);
export const ProvidesToList = decoratorFactory(ProvidesToListAnnotation);
export const ProvidesToMap = decoratorFactory(ProvidesToMapAnnotation);
