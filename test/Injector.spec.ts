import { Injector, Promises, Provides, Singleton } from '../src';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Injector', () => {
  describe('', () => {
    jest.setTimeout(5000);
    it('singleton providers should not require await after emitting ready', function (done) {
      class FirstModule {
        @Provides('slowItem')
        @Singleton()
        async getSlowItem(): Promise<number> {
          await wait(1000);
          return 3;
        }

        @Singleton()
        @Promises('promiseItem')
        async getPromiseItem(): Promise<number> {
          await wait(1000);
          return 2;
        }
      }

      class AnotherModule {
        @Provides('number')
        getNumber(): number {
          return 1;
        }
      }

      const injector = new Injector(new FirstModule(), new AnotherModule());
      injector.once('ready', async () => {
        expect(injector.get('slowItem')).toBe(3)
        expect(injector.get('promiseItem')).toBe(2)
        done();
      });
      expect(injector.get('number')).toBe(1);
    });
  });
});
