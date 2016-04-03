import {} from 'reflect-metadata';

class InjectAnnotation {
  constructor() {

  }
}

class ProvidesAnnotation {
  constructor() {

  }
}

class Annotations {
  static setAnnotation(o, AnnotationType) {
    return Reflect.defineMetadata(AnnotationType, o, "method");
  }
  static getAnnotation(o, AnnotationType) {
    return Reflect.getMetadata(AnnotationType, o, "method");
  }
}

export { InjectAnnotation, ProvidesAnnotation, Annotations };
