import { Inject, Injector, Provides, ProvidesToMap } from '../src';

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
      injector.get<Promise<Record<string, string>>>('myMap').then(res => {
        expect(Object.keys(res)).toHaveLength(3);
        done();
      });
    });

    it('should be able to provide binding when injecting map binding', async () => {
      class MyModule {
        @ProvidesToMap('myMap', 'World')
        get1() {
          return 'World';
        }

        @ProvidesToMap('myMap', 'Hello')
        getHello() {
          return 'Hello';
        }
      }

      class MessageModule {
        @Provides('message')
        @Inject('myMap')
        consumeMyMap(myMap: Record<string, string>) {
          return `${myMap.Hello} ${myMap.World}`;
        }
      }

      class ConsumerModule {
        @Provides('consumer')
        @Inject('message')
        consumeMyMap(consumer: null) {
          expect(consumer).toBe('Hello World');
        }
      }

      const injector = new Injector(new MyModule(), new MessageModule(), new ConsumerModule());
      await injector.get('consumer');
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
      injector.get<Promise<Record<string, string>>>('myMap').then(res => {
        expect(Object.keys(res)).toHaveLength(3);
        done();
      });
    });
  });
});
