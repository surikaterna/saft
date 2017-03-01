import { } from 'reflect-metadata';
import { Key } from '../key';


class Annotations {
  static setAnnotation(annotation, target, key) {
    const annotations = Reflect.getMetadata('annotations', target, key) || [];
    annotations.push(annotation);
    return Reflect.defineMetadata('annotations', annotations, target, key);
  }
  static getAnnotations(AnnotationType, target, key) {
    const annotations = Reflect.getMetadata('annotations', target, key) || [];
    const result = annotations.filter(x => (x instanceof AnnotationType));
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

class InjectAnnotation {
  constructor(...keys) {
    this._keys = keys.map(k => {
      let r;
      if (!(k instanceof Key)) {
        r = Key.fromToken(k);
      } else {
        r = k;
      }
      return r;
    });
  }
  getKeys() {
    return this._keys;
  }
}

class InjectableAnnotation {
  constructor() {

  }
}

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

class SingletonAnnotation {
  scope(key, unscopedProvider) {
    const instances = {};
    return () => {
      const rawKey = key.getRawKey();
      let instance = instances[rawKey];
      if (!instances[rawKey]) {
        instance = instances[rawKey] = unscopedProvider();
      }
      return instance;
    };
  }
}

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
class ListBinder {

  static get(binder, key) {
    if (!binder._multiBinders) {
      binder._multiBinders = {};
    }
    let listBinder = binder._multiBinders[key];
    if (!listBinder) {
      binder._multiBinders[key] = listBinder = new ListBinder();
      binder.bindKey(key).toProvider(() => {
        return listBinder._getValues();
      });
    }
    return listBinder;
  }

  constructor() {
    this._list = [];
  }

  toProvider(fn) {
    this._list.push(fn);
  }

  _getList() {
    return this._list;
  }
  _getValues() {
    return this._list.map((e) => e());
  }
}


class ProvidesToListAnnotation extends BindingAnnotation {
  bind(binder, target, targetKey) {
    const listBinder = ListBinder.get(binder, this._key);
    listBinder.toProvider(() => 'hello');
  }
}


class PromisesAnnotation extends ProvidesAnnotation {
  constructor(key) {
    super(key, true);
  }
}



/*
function MyAnnotation(options): Decorator {
  return (target, key) => Reflect.defineMetadata('custom:annotation', options, target, key);
}
*/
export {
  InjectAnnotation, ProvidesAnnotation, InjectableAnnotation,
  Annotations, PromisesAnnotation, SingletonAnnotation, BindingAnnotation, ProvidesToListAnnotation,
};
