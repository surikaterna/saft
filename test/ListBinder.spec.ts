import { Inject, Injector, ListBinder, Provides, ProvidesToList, Singleton } from '../src';
import { Binder } from '../src/binder';

describe('ListBinder', () => {
  describe('ProvidesToList', () => {
    it('should allow to bind multiple values to Key', function (done) {
      class MyModule {
        configure(binder: Binder) {
          const listBinder = ListBinder.get(binder, 'myList');
          listBinder.bindToList().toProvider(() => 'hello');
        }
      }

      class MySecondModule {
        configure(binder: Binder) {
          const listBinder = ListBinder.get(binder, 'myList');
          listBinder.bindToList(/** sort order **/ 9).toProvider(() => 'world');
          listBinder.bindToList(1).toProvider(() => '!');
        }
      }

      const injector = new Injector(new MyModule(), new MySecondModule());
      injector.get('myList').then((res) => {
        expect(res).toHaveLength(3);
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
        @ProvidesToList('myList', undefined, true)
        getItem() {
          return Promise.resolve('World');
        }
      }

      class MyThirdModule {
        @ProvidesToList('myList')
        getItem() {
          return '!';
        }
      }

      const injector = new Injector(new MyModule(), new MySecondModule(), new MyThirdModule());
      injector.get('myList').then((res) => {
        expect(res).toHaveLength(3);
        done();
      });
    });
    it('should work with @Singleton', function (done) {
      class MyModule {
        private _i: number;

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
      injector.get('myList').then((res) => {
        expect(res[0]).toBe('Hello 0');
        done();
      });
    });
    it('should work with @Singleton in multiple binder levels', function (done) {
      class MyModule {
        private _i: number;

        constructor() {
          this._i = 0;
        }

        @Provides('counter')
        @Singleton()
        getCounter() {
          if (this._i === 1) throw new Error();
          return this._i++;
        }

        @ProvidesToList('myList')
        @Singleton()
        @Inject('counter')
        getItem(counter: number) {
          return 'Hello ' + counter;
        }
      }

      const injector = new Injector(new MyModule());
      injector.get('myList');
      injector.get('myList').then((res) => {
        expect(res[0]).toBe('Hello 0');
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
        getPhrase(list: Array<string>) {
          return list.join(' ');
        }
      }

      const injector = new Injector(new MyModule());
      injector.get('phrase').then((res) => {
        expect(res).toBe('Hello World !');
        done();
      });
    });
  });
});
