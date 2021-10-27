import { Annotations } from '../../src/annotations';

class Annot {
  constructor(val) {
    this._val = val;
  }
}

class Annot2 {
  constructor(val) {
    this._val = val;
  }
}

describe('Annotations', () => {
  describe('getAnnotation', () => {
    it('should return same instance previously set', () => {
      class K {
      }
      // Have to send in object of String so that getAnotation of type will work...
      const annotation = new Annot('test');
      Annotations.setAnnotation(annotation, K);
      expect(annotation).toBe(Annotations.getAnnotation(Annot, K));
    });
  });
  describe('getAnnotations', () => {
    it('should return all instances previously set', () => {
      class K {
      }
      Annotations.setAnnotation(new Annot('t1'), K);
      Annotations.setAnnotation(new Annot('t2'), K);
      expect(Annotations.getAnnotations(Annot, K)).toHaveLength(2);
    });
    it('should return all instances previously set but only of same type', () => {
      class K {
      }
      Annotations.setAnnotation(new Annot('t1'), K);
      Annotations.setAnnotation(new Annot('t2'), K);
      Annotations.setAnnotation(new Annot2('t222'), K);
      expect(Annotations.getAnnotations(Annot, K)).toHaveLength(2);
      expect(Annotations.getAnnotations(Annot2, K)).toHaveLength(1);
    });
  });
});
