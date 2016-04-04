import { InjectableAnnotation, InjectAnnotation, ProvidesAnnotation, Annotations } 
  from './annotations';


let decoratorFactory = function (AnnotationClass) {
  var clzz = AnnotationClass;
  return function(...params) {
    console.log("IN FACTORY", params);
    return function(target, key) {
      console.log("IN IN ", arguments)
      console.log("IN >>", arguments[0].length)
      var annotation = Object.create(AnnotationClass.prototype);
      console.log(">>>", annotation);
      AnnotationClass.apply(annotation, params);
      console.log(">>>", annotation);
      Annotations.setAnnotation(annotation, target, key);
    };
  };
};

// Multibinder
// InjectProvider
export let Inject = decoratorFactory(InjectAnnotation);

export let Provides = decoratorFactory(ProvidesAnnotation);

//angularized
export let Injectable = decoratorFactory(InjectableAnnotation);
