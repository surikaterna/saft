import { Annotations } from './Annotations';
import { BindingAnnotation } from './BindingAnnotation';
import { EagerSingletonAnnotation } from './EagerSingletonAnnotation';
import { InjectAnnotation } from './InjectAnnotation';
import { ProvidesAnnotation } from './ProvidesAnnotation';
import { ProvidesToListAnnotation } from './ProvidesToListAnnotation';
import { ProvidesToMapAnnotation } from './ProvidesToMapAnnotation';
import { PromisesAnnotation } from './PromisesAnnotation';
import { SingletonAnnotation } from './SingletonAnnotation';

/*
function MyAnnotation(options): Decorator {
  return (target, key) => Reflect.defineMetadata('custom:annotation', options, target, key);
}
*/
export {
  InjectAnnotation,
  ProvidesAnnotation,
  Annotations,
  PromisesAnnotation,
  SingletonAnnotation,
  BindingAnnotation,
  ProvidesToListAnnotation,
  ProvidesToMapAnnotation,
  EagerSingletonAnnotation
};
