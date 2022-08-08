import Promise from 'bluebird';
import { Provides, Inject, Promises, Injector } from '../src';

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
      injector.get<Promise<string>>('Aloha').then(e => {
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
        getHawaii(aloha: string) {
          return `Hello ${aloha}`;
        }
      }
      const injector = new Injector(new MyModule());
      injector.get<Promise<string>>('Hawaii').then(e => {
        expect(e).toBe('Hello Tjingeling');
        done();
      });
    });
  });
});

