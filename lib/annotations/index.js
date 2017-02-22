import {} from 'reflect-metadata';
import { Key } from '../key';

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

class ProvidesAnnotation {
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
}

class PromisesAnnotation extends ProvidesAnnotation {
  constructor(key) {
    super(key, true);
  }
}

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
/*
function MyAnnotation(options): Decorator {
  return (target, key) => Reflect.defineMetadata('custom:annotation', options, target, key);
}
*/
export { InjectAnnotation, ProvidesAnnotation, InjectableAnnotation,
   Annotations, PromisesAnnotation };
