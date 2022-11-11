import { Inject, Injector, Promises, Provides, Singleton } from '../src';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Injector', () => {
  describe('', () => {
    it('singleton providers should not require await after emitting ready', (done) => {
      class FirstModule {
        @Provides('asyncSingleton')
        @Singleton()
        async getSlowNumber(): Promise<number> {
          await wait(50);
          return 3;
        }

        @Promises('inject promise')
        async getString(): Promise<string> {
          await wait(50);
          return 'non-singleton promise injected to singleton';
        }

        @Singleton()
        @Provides('singletonUsingInject')
        @Inject('inject promise')
        getInput(input: string): string {
          return input;
        }

        @Singleton()
        @Promises('singletonAsyncPromises')
        async getPromiseNumber(): Promise<number> {
          await wait(50);
          return 2;
        }
      }

      class AnotherModule {
        @Provides('syncProvider')
        getNumber(): number {
          return 1;
        }
      }

      class ChildModule {
        @Provides('childAsyncSingleton')
        @Singleton()
        async getSlowNumber(): Promise<number> {
          await wait(50);
          return 5;
        }
      }

      const injector = new Injector(new FirstModule(), new AnotherModule());
      const childInjector = injector.createChildInjector(new ChildModule());
      let readyEvents = 0;

      childInjector.once('ready', () => {
        readyEvents++;
        expect(childInjector.get('childAsyncSingleton')).toBe(5);
        if (readyEvents === 2) {
          done();
        }
      });
      injector.once('ready', () => {
        readyEvents++;
        expect(injector.get('asyncSingleton')).toBe(3);
        expect(injector.get('singletonAsyncPromises')).toBe(2);
        expect(injector.get('singletonUsingInject')).toBe('non-singleton promise injected to singleton');
        if (readyEvents === 2) {
          done();
        }
      });
      expect(injector.get('syncProvider')).toBe(1);
    });
  });
});
