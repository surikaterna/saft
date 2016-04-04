import { Annotations } from '../../lib/annotations';
import should from 'should';

describe('Annotations', function () {
  describe('getAnnotation', function () {
    it('should return same instance previously set', function () {
      class K {
      }

      Annotations.setAnnotation('test', K);
      'test'.should.equal(Annotations.getAnnotation('test', K));
    });
  });
});
