import { Provides, Inject, Provider, Singleton, Injector, ProvidesToList } from '..';
import should from 'should';

describe('Injector', () => {
  describe('ProvidesToList', () => {
    xit('should allow to bind multiple values to Key', () => {
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
    it('should allow to bind multiple values to Key with annotation', function(done) {
      class MyModule {
        @ProvidesToList('myList')
        getItem() {
          return 'Hello';
        }
      }

      class MySecondModule {
        @ProvidesToList('myList')
        getItem() {
          return 'World';
        }
      }

      const injector = new Injector(new MyModule(), new MySecondModule());
      injector.get('myList').then(res => { 
        res.length.should.equal(2);
        done();
      });
    });
    it('should work with @Singleton', function (done) {
      class MyModule {
        constructor() {
          this._i = 0;
        }
        @ProvidesToList('myList')
        @Singleton()
        getItem() {
          return 'Hello ' + this._i++;
        }
      }
      const injector = new Injector(new MyModule());
      injector.get('myList');
      injector.get('myList').then(res => {
        res[0].should.equal('Hello 0');
        done();
      });
    });
    xit('should work with @Singleton in multiple binder levels', function (done) {
      class MyModule {
        constructor() {
          this._i = 0;
        }

        @Provides('counter')
        @Singleton()
        getCounter() {
          return this._i++;
        }

        @ProvidesToList('myList')
        @Singleton()
        @Inject('counter')
        getItem(counter) {
          return 'Hello ' + counter;
        }
      }
      const injector = new Injector(new MyModule());
      injector.get('counter');
      injector.get('myList');
      injector.get('myList').then(res => {
        res[0].should.equal('Hello 0');
        done();
      });
    });
  });
});
