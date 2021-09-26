import { Provides, Inject, Provider, Singleton, Injector } from '..';
import should from 'should';

describe('ChildInjector', () => {
  describe('Provides', () => {
    it('should return parent bindings if not found in child', () => {
      class MyModule {
        constructor(message) {
          this._message = message;
        }
        @Provides('Aloha')
        getAloha() {
          return this._message;
        }
      }
      class MyChildModule {
        constructor(message) {
          this._message = message;
        }
        @Provides('AlohaChild')
        getAloha() {
          return this._message;
        }
      }
      const injector = new Injector(new MyModule('Hi Ho'));
      const childInjector = injector.createChildInjector(new MyChildModule('Hi 2'));
      childInjector.get('AlohaChild').should.equal('Hi 2');
      childInjector.get('Aloha').should.equal('Hi Ho');
    });
  });
});