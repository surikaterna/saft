import { Inject, Injector, Promises, Provides, Singleton } from '../src';
import { after } from 'lodash';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Injector', () => {
  describe('', () => {
    jest.setTimeout(5000);
    it('singleton providers should not require await after emitting ready', (done) => {
      class FirstModule {
        @Provides('asyncSingleton')
        @Singleton()
        async getSlowNumber(): Promise<number> {
          await wait(500);
          return 3;
        }

        @Promises('inject promise')
        async getString(): Promise<string> {
          await wait(500);
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
          await wait(500);
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
          await wait(500);
          return 5;
        }
      }

      const injector = new Injector(new FirstModule(), new AnotherModule());
      const childInjector = injector.createChildInjector(new ChildModule());
      const partDone = after(2, done);
      childInjector.once('ready', async () => {
        expect(childInjector.get('childAsyncSingleton')).toBe(5);
        partDone();
      });
      injector.once('ready', async () => {
        expect(injector.get('asyncSingleton')).toBe(3);
        expect(injector.get('singletonAsyncPromises')).toBe(2);
        expect(injector.get('singletonUsingInject')).toBe('non-singleton promise injected to singleton');
        partDone();
      });
      expect(injector.get('syncProvider')).toBe(1);
    });
  });
});
