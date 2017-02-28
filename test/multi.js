import { Provides, Inject, Provider, Singleton, Injector } from '..';
import should from 'should';

class ListBinder {

  static get(binder, key) {
    if (!binder._multiBinders) {
      binder._multiBinders = {};
    }
    let listBinder = binder._multiBinders[key];
    if (!listBinder) {
      binder._multiBinders[key] = listBinder = new ListBinder();
      binder.bindKey(key).toProvider(() => {
        return listBinder._getValues();
      });
    }
    return listBinder;
  }

  constructor() {
    this._list = [];
  }

  toProvider(fn) {
    this._list.push(fn);
  }

  _getList() {
    return this._list;
  }
  _getValues() {
    return this._list.map((e) => e());
  }
}

describe('Injector', () => {
  describe('ProvidesList', () => {
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
    it.only('should allow to bind multiple values to Key with annotation', () => {
      class MyModule {
        @ProvidesListItem('myList')
        getItem() {
          return 'Hello'
        }
      }

      class MySecondModule {
        @ProvidesListItem('myList')
        getItem() {
          return 'World'
        }
      }

      const injector = new Injector(new MyModule(), new MySecondModule());
      injector.get('myList').length.should.equal(2);
    });
  });
});
