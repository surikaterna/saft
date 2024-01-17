import { Provides, Inject, Provider, Singleton, Injector } from '../src';

describe('Injector', () => {
  describe('Provides', () => {
    it('should return correct instance', () => {
      class MyModule {
        @Provides('Aloha')
        getAloha() {
          return 'Tjingeling';
        }
      }
      const injector = new Injector(new MyModule());
      expect(injector.get('Aloha')).toBe('Tjingeling');
    });
    it('should return correct instance with multiple provides', () => {
      class MyModule {
        @Provides('Aloha')
        getAloha() {
          return 'Tjingeling';
        }
        @Provides('Hawaii')
        getHawaii() {
          return 'Tjo';
        }
      }
      const injector = new Injector(new MyModule());

      expect(injector.get('Aloha')).toBe('Tjingeling');
      expect(injector.get('Hawaii')).toBe('Tjo');
    });
    it('should call provides method with correct this', () => {
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
      const injector = new Injector(new MyModule('Hi Ho'));
      expect(injector.get('Aloha')).toBe('Hi Ho');
    });
    it('should throw when Provides function needs arguments but no Inject', () => {
      class MyModule {
        @Provides('Hello')
        getHelloWorld(aloha: string) {
          return `Tjo ${aloha}`;
        }
      }
      expect(() => {
        const injector = new Injector(new MyModule());
        injector.get('Hello');
      }).toThrow();
    });
    it('should throw when Provides has more params then Inject specifies', () => {
      class MyModule {
        @Provides('Hello')
        @Inject('test')
        getHelloWorld(aloha: string) {
          return `Tjo ${aloha}`;
        }
      }
      expect(() => {
        const injector = new Injector(new MyModule());
        injector.get('Hello');
      }).toThrow()
    });
    it('should inject dependencies to provides method', () => {
      class MyModule {
        @Provides('Aloha')
        getAloha() {
          return 'Tjingeling';
        }
        @Provides('Hello')
        @Inject('Aloha')
        getHelloWorld(aloha: string) {
          return `Tjo ${aloha}`;
        }
      }
      const injector = new Injector(new MyModule());
      expect(injector.get('Hello')).toBe('Tjo Tjingeling');
    });
    it('should inject dependencies as provider to provides method', () => {
      class MyModule {
        @Provides('Aloha')
        getAloha() {
          return 'Tjingeling';
        }
        @Provides('Hello')
        @Inject(Provider('Aloha'))
        getHelloWorld(aloha: () => string) {
          return `Tjo ${aloha()}`;
        }
      }
      const injector = new Injector(new MyModule());
      expect(injector.get('Hello')).toBe('Tjo Tjingeling');
    });
    it('should inject same instance for Singleton', () => {
      class MyModule {
        private _id: number;

        constructor() {
          this._id = 11;
        }
        @Provides('counter')
        @Singleton()
        getCounter() {
          return this._id++;
        }
      }
      const injector = new Injector(new MyModule());
      const c1 = injector.get('counter');
      const c2 = injector.get('counter');
      expect(c1).toBe(c2);
    });

    it('should provide information about method unsatisfied parameters for argument length mismatch', (done) => {
      class MyModule {
        @Singleton()
        @Provides('counter')
        @Inject('a', 'b')
        getCounter(_a: string) {
        }
      }

      try {
        new Injector(new MyModule());
        done(new Error('Should give error on unsatisfied parameters for argument length mismatch '))
      } catch (err: any) {
        expect(err.message).toBe(`Function "getCounter" for "@Provides('counter')" has unsatisfied parameters. @Inject specifies 2 keys and function expects 1 parameters`)
        done();
      }
    });

    it('should call configure on module', (done) => {
      class MyModule {
        configure() {
          done();
        }
      }
      new Injector(new MyModule());
    });
  });
});
