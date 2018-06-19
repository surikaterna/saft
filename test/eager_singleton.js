import { Provides, Inject, Provider, Promises, EagerSingleton, Singleton, Injector } from '..';
import should from 'should';

describe('EagerSingleton', () => {
  describe('Provides', () => {
    it('should create instance when bound', () => {
      class MyModule2 {
        constructor() {
        }
        @Provides('counter')
        @Singleton()
        getCounter() {
          return {
            count: 0
          };
        }
      }

      class MyModule {
        constructor() {
        }

        @Provides('main')
        @EagerSingleton()
        @Inject('counter')
        getCount(counter) {
          counter.count++;
          return counter;
        }
      }

      const modules = [new MyModule(), new MyModule2()];
      const injector = new Injector(...modules);

      injector.get('counter').count.should.equal(1);
      const c1 = injector.get('main');
      const c2 = injector.get('main');
      c1.should.equal(c2);
    });

    it('should emit done when initiated', (done) => {
      class MyModule3 {
        @Promises('delayedValue')
        @EagerSingleton()
        getCounter() {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve('done');
            }, 250);
          });
        }
      }

      const modules = [new MyModule3()];
      const injector = new Injector(...modules);

      injector.on('ready', () => {
        done();
      });
    });
  });
});