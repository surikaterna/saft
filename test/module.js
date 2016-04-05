import { Provides, Inject, Provider } from '../lib/decorators';
import { Injector } from '../lib/injector';
import should from 'should';



describe.only('Injector', function() {
  describe('Provides', function() {
    it('should return correct instance', function() {
      class MyModule {
        @Provides('Aloha')
        getAloha() {
          return 'Tjingeling';
        }
      }
      const injector = new Injector(new MyModule());
      injector.get('Aloha').should.equal('Tjingeling');
    });
    it('should return correct instance with multiple provides', function() {
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
      injector.get('Aloha').should.equal('Tjingeling');
      injector.get('Hawaii').should.equal('Tjo');
    });
    it('should call provides method with correct this', function() {
      class MyModule {
        constructor(message) {
          this._message = message;
        }
        @Provides('Aloha')
        getAloha() {
          return this._message;
        }
      }
      const injector = new Injector(new MyModule('Hi Ho'));
      injector.get('Aloha').should.equal('Hi Ho');
    });
    it('should throw when Provides function needs arguments but no Inject', function() {
      class MyModule {
        @Provides('Hello')
        getHelloWorld(aloha) {
          return `Tjo ${aloha}`;
        }
      }
      should.throws(() => {
        const injector = new Injector(new MyModule());
        injector.get('Hello');
      });
    });
    it('should throw when Provides function needs arguments but no Inject', function() {
      class MyModule {
        @Provides('Hello')
        @Inject('test')
        getHelloWorld(aloha, aloha2) {
          return `Tjo ${aloha}`;
        }
      }
      should.throws(() => {
        const injector = new Injector(new MyModule());
        injector.get('Hello');
      });
    });
    it('should inject dependencies to provides method', function() {
      class MyModule {
        @Provides('Aloha')
        getAloha() {
          return 'Tjingeling';
        }
        @Provides('Hello')
        @Inject(Provider('Aloha'))
        getHelloWorld(aloha) {
          return `Tjo ${aloha}`;
        }
      }
      const injector = new Injector(new MyModule());
      injector.get('Hello').should.equal('Tjo Tjingeling');
    });
  });
});
