import { ListBinder } from '../binder/ListBinder';
import { MapBinder } from '../binder/MapBinder';
import { Annotations } from './Annotations';
import { BindingAnnotation } from './BindingAnnotation';
import { EagerSingletonAnnotation } from './EagerSingletonAnnotation';
import { InjectAnnotation } from './InjectAnnotation';
import { SingletonAnnotation } from './SingletonAnnotation';

class ProvidesAnnotation extends BindingAnnotation {
  bind(binder, target, targetKey) {
    const provide = this;
    const fn = target[targetKey];
    let scope;
    if (Annotations.hasAnnotation(SingletonAnnotation, target, targetKey)) {
      scope = Annotations.getAnnotation(SingletonAnnotation, target, targetKey);
    }
    // check arguments
    if (fn.length !== 0) {
      if (!Annotations.hasAnnotation(InjectAnnotation, target, targetKey)) {
        throw new Error('@Provides function has unsatisfied parameters, @Inject is missing',
          target, k);
      } else {
        // we have a provides function which should have things injected
        const inject = Annotations.getAnnotation(InjectAnnotation, target, targetKey);
        if (inject.getKeys().length !== fn.length) {
          throw new Error(`@Provides function has unsatisfied parameters, @Inject specifies
                 ${inject.getKeys().length} keys and function expects ${fn.length} parameters`);
        }
        const key = provide.key;
        binder.bindKey(key)
          .toProvider(fn.bind(target), inject.getKeys(), provide.asPromise).in(scope);
      }
    } else {
      const key = provide.key;
      binder.bindKey(key).toProvider(fn.bind(target), null, provide.asPromise).in(scope);
    }
  }
}
ProvidesAnnotation._name = 'ProvidesAnnotation';

class ProvidesToListAnnotation extends BindingAnnotation {
  constructor(key, sortOrder, asPromise) {
    super(key, asPromise);
    this._sortOrder = sortOrder;
  }

  bind(binder, target, targetKey) {
    const listBinder = ListBinder.get(binder, this._key);
    const itemKey = listBinder._getKey(this._sortOrder);
    new ProvidesAnnotation(itemKey, this._asPromise).bind(listBinder, target, targetKey);
  }
}
ProvidesToListAnnotation._name = 'ProvidesToListAnnotation';

class ProvidesToMapAnnotation extends BindingAnnotation {
  constructor(key, itemKey, asPromise) {
    super(key, asPromise);
    this._itemKey = itemKey;
    if (!key || !itemKey) {
      throw new Error('Unable to bind to map with key / itemKey', key, itemKey);
    }
  }

  bind(binder, target, targetKey) {
    const mapBinder = MapBinder.get(binder, this._key);
    new ProvidesAnnotation(this._itemKey, this._asPromise).bind(mapBinder, target, targetKey);
  }
}
ProvidesToMapAnnotation._name = 'ProvidesToMapAnnotation';


class PromisesAnnotation extends ProvidesAnnotation {
  constructor(key) {
    super(key, true);
  }
}
PromisesAnnotation._name = 'PromisesAnnotation';



/*
function MyAnnotation(options): Decorator {
  return (target, key) => Reflect.defineMetadata('custom:annotation', options, target, key);
}
*/
export {
  InjectAnnotation, ProvidesAnnotation,
  Annotations, PromisesAnnotation, SingletonAnnotation, BindingAnnotation, ProvidesToListAnnotation,
  ProvidesToMapAnnotation, EagerSingletonAnnotation
};
