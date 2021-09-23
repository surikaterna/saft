import { Provides, Inject, Promises, Injector } from '..';
import * as Promise from 'bluebird';

// async goodness
describe('InjectorAsync', () => {
  describe('Provides', () => {
    it('should return promise', (done) => {
      class MyModule {
        @Provides('Aloha')
        getAloha() {
          return Promise.resolve('Tjingeling');
        }
      }
      const injector = new Injector(new MyModule());
      injector.get('Aloha').then(e => {
        expect(e).toBe('Tjingeling');
        done();
      });
    });
    it('should resolve promise before injecting to next step', (done) => {
      class MyModule {
        @Promises('Aloha')
        getAloha() {
          return Promise.resolve('Tjingeling');
        }
        @Inject('Aloha')
        @Provides('Hawaii')
        getHawaii(aloha) {
          return `Hello ${aloha}`;
        }
      }
      const injector = new Injector(new MyModule());
      injector.get('Hawaii').then(e => {
        expect(e).toBe('Hello Tjingeling');
        done();
      });
    });
  });
});

