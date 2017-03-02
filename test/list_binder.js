import { Provides, Inject, ListBinder, Singleton, Injector, ProvidesToList } from '..';
import should from 'should';

describe('ListBinder', () => {
  describe('ProvidesToList', () => {
    it('should allow to bind multiple values to Key', function (done) {
      class MyModule {

        configure(binder) {
          const listBinder = ListBinder.get(binder, 'myList');
          listBinder.bindToList().toProvider(() => 'hello');
        }
      }

      class MySecondModule {
        configure(binder) {
          const listBinder = ListBinder.get(binder, 'myList');
          listBinder.bindToList(/** sort order **/ 9).toProvider(() => 'world');
          listBinder.bindToList(1).toProvider(() => '!');
        }
      }

      const injector = new Injector(new MyModule(), new MySecondModule());
      injector.get('myList').then(res => {
        res.length.should.equal(3);
        done();
      });
    });
    it('should allow to bind multiple values to Key with annotation', function (done) {
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
    it('should work with @Singleton in multiple binder levels', function (done) {
      class MyModule {
        constructor() {
          this._i = 0;
        }

        @Provides('counter')
        @Singleton()
        getCounter() {
          if (this._i === 1)
            throw new Error();
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
      injector.get('myList');
      injector.get('myList').then(res => {
        res[0].should.equal('Hello 0');
        done();
      });
    });
    it('should be possible to inject list', function (done) {
      class MyModule {

        @ProvidesToList('myList', 22)
        get1() {
          return 'World';
        }
        @ProvidesToList('myList', 1)
        getHello() {
          return 'Hello';
        }
        @ProvidesToList('myList')
        getA() {
          return '!';
        }

        @Provides('phrase')
        @Inject('myList')
        getPhrase(list) {
          return list.join(' ');
        }
      }
      const injector = new Injector(new MyModule());
      injector.get('phrase').then(res => {
        res.should.equal('Hello World !');
        done();
      });
    });    
  });
});
