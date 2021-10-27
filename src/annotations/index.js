import { Key } from '../Key';
import { ListBinder } from '../binder/list_binder';
import { MapBinder } from '../binder/map_binder';
import { InjectAnnotation } from './InjectAnnotation';

class Annotations {
  static setAnnotation(annotation, target, key) {
    const annotations = Reflect.getMetadata('annotations', target, key) || [];
    annotations.push(annotation);
    return Reflect.defineMetadata('annotations', annotations, target, key);
  }
  static getAnnotations(AnnotationType, target, key) {
    const annotations = Reflect.getMetadata('annotations', target, key) || [];
    const result = annotations.filter(x => (x instanceof AnnotationType
      || (Object.getPrototypeOf(x.constructor)._name && Object.getPrototypeOf(x.constructor)._name === AnnotationType._name)));
    return result;
  }
  static hasAnnotation(AnnotationType, target, key) {
    return Annotations.getAnnotations(AnnotationType, target, key).length !== 0;
  }

  static getAnnotation(AnnotationType, target, key) {
    const res = Annotations.getAnnotations(AnnotationType, target, key);
    if (res.length !== 1) {
      throw new Error(`There is ${res.length} annotations available of type ${AnnotationType}`);
    }
    return res[0];
  }
}

class InjectableAnnotation {
  constructor() {

  }
}
InjectableAnnotation._name = 'InjectableAnnotation';

class BindingAnnotation {
  constructor(key, asPromise = false) {
    this._key = key;
    this._asPromise = asPromise;
  }
  get key() {
    return this._key;
  }

  get asPromise() {
    return this._asPromise;
  }
  bind(target, targetKey, binder) {
    throw new Error('Binding needs to override bind()');
  }
}
BindingAnnotation._name = 'BindingAnnotation';

class SingletonAnnotation {
  scope(key, unscopedProvider) {
    const instances = {};
    return () => {
      const rawKey = key.getRawKey();
      let instance = instances[rawKey];
      if (instances[rawKey] === undefined) {
        instance = instances[rawKey] = unscopedProvider();
      }
      return instance;
    };
  }
}
SingletonAnnotation._name = 'SingletonAnnotation';

class EagerSingletonAnnotation extends SingletonAnnotation {
}
EagerSingletonAnnotation._name = 'EagerSingletonAnnotation';


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
  InjectAnnotation, ProvidesAnnotation, InjectableAnnotation,
  Annotations, PromisesAnnotation, SingletonAnnotation, BindingAnnotation, ProvidesToListAnnotation,
  ProvidesToMapAnnotation, EagerSingletonAnnotation
};
