import { Annotations } from '../../lib/annotations';
import should from 'should';

describe('Annotations', function () {
  describe('getAnnotation', function () {
    it('should return same instance previously set', function () {
      class K {
          
      }
      Annotations.setAnnotation(K, 'test', 'boot');
      'test'.should.equal(Annotations.getAnnotation(K, 'boot'));
      
    });
  });
});
