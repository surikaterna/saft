import { Provides, Injector } from '../src';

describe('ChildInjector', () => {
  describe('Provides', () => {
    it('should return parent bindings if not found in child', () => {
      class MyModule {
        private readonly _message: string;

        constructor(message: string) {
          this._message = message;
        }
        @Provides('Aloha')
        getAloha() {
          return this._message;
        }
      }
      class MyChildModule {
        private readonly _message: string;

        constructor(message: string) {
          this._message = message;
        }
        @Provides('AlohaChild')
        getAloha() {
          return this._message;
        }
      }
      const injector = new Injector(new MyModule('Hi Ho'));
      const childInjector = injector.createChildInjector(new MyChildModule('Hi 2'));
      expect(childInjector.get('AlohaChild')).toBe('Hi 2');
      expect(childInjector.get('Aloha')).toBe('Hi Ho');
    });
  });
});
