import { Provides, Inject, Provider, Singleton, Injector } from '..';
import should from 'should';

class ListBinder {
  static get(binder, key) {
    let listBinder;
    if(binder.getBinding(key) instanceof ListBinder)
  }
  bindKey(key) {

  }
}

describe('Injector', () => {
  describe('ProvidesList', () => {
    it.only('should allow to bind multiple values to Key', () => {
      class MyModule {

        configure(binder) {

        }
      }
      console.log('met');
      const injector = new Injector(new MyModule());
      console.log('meta');
    });
  });
});
