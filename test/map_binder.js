import { Injector, ProvidesToMap } from '..';
import should from 'should';

describe('MapBinder', () => {
  describe('ProvidesToMap', () => {
    it('should be possible to provide map entries', function (done) {
      class MyModule {

        @ProvidesToMap('myMap', 'World')
        get1() {
          return 'World';
        }
        @ProvidesToMap('myMap', 'Hello')
        getHello() {
          return 'Hello';
        }
        @ProvidesToMap('myMap', '!')
        getA() {
          return '!';
        }
      }
      const injector = new Injector(new MyModule());
      injector.get('myMap').then(res => {
        Object.keys(res).length.should.equal(3);
        done();
      });
    });
    it('should be possible to provide map entries by Promise', function (done) {
      class MyModule {

        @ProvidesToMap('myMap', 'World')
        get1() {
          return 'World';
        }
        @ProvidesToMap('myMap', 'Hello', true)
        getHello() {
          return Promise.resolve('Hello');
        }
        @ProvidesToMap('myMap', '!')
        getA() {
          return '!';
        }
      }
      const injector = new Injector(new MyModule());
      injector.get('myMap').then(res => {
        Object.keys(res).length.should.equal(3);
        done();
      });
    });
  });
});
