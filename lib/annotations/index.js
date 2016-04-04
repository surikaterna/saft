import {} from 'reflect-metadata';

class InjectAnnotation {
  constructor(...keys) {
     console.log('INJECT: ', arguments);
     this._keys = keys;
  }
}

class InjectableAnnotation {
  constructor() {

  }
}

class ProvidesAnnotation {
  constructor(key) {
     console.log('PROVIDES: ', arguments);
    this._key = key;
  }
}

class Annotations {
  static setAnnotation(annotation, target, key) {
    console.log('SET', arguments);
    var annotations = Reflect.getMetadata('annotations', target, key) || [];
    //var annotation = Object.create(AnnotationType.prototype);
    //AnnotationType.apply(annotation, )
    annotations.push(annotation);
    return Reflect.defineMetadata('annotations', annotations, target, key);
  }
  static getAnnotation(AnnotationType, target, key) {
    console.log('GET', arguments);
    return Reflect.getMetadata('annotations', target, key);
  }
}
/*
function MyAnnotation(options): Decorator {
  return (target, key) => Reflect.defineMetadata('custom:annotation', options, target, key);
}
*/
export { InjectAnnotation, ProvidesAnnotation, InjectableAnnotation, Annotations };
