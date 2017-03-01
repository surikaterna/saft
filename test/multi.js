import { Provides, Inject, Provider, Singleton, Injector, ProvidesToList } from '..';
import should from 'should';

describe('Injector', () => {
  xdescribe('ProvidesList', () => {
    it('should allow to bind multiple values to Key', () => {
      class MyModule {

        configure(binder) {
          const listBinder = ListBinder.get(binder, 'myList');
          listBinder.toProvider(() => 'hello');
        }
      }

      class MySecondModule {
        configure(binder) {
          const listBinder = ListBinder.get(binder, 'myList');
          listBinder.toProvider(() => 'world');
        }
      }

      const injector = new Injector(new MyModule(), new MySecondModule());
      injector.get('myList').length.should.equal(2);
    });
    xit('should allow to bind multiple values to Key with annotation', () => {
      class MyModule {
        @ProvidesToList('myList')
        getItem() {
          return 'Hello'
        }
      }

      class MySecondModule {
        @ProvidesToList('myList')
        getItem() {
          return 'World'
        }
      }

      const injector = new Injector(new MyModule(), new MySecondModule());
      injector.get('myList').length.should.equal(2);
    });
  });
});
