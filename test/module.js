import { Provides, Inject } from '../lib/decorators'
import { Injector } from '../lib/injector'

class MyModule {

  @Provides('Aloha')
  getAloha() {
    return 'Tjingeling'
  }
}

describe.only('Injector', function() {
	describe('Provides', function() {
		it('should return correct instance', function() {
			let injector = new Injector(new MyModule());
			injector.get('Aloha').should.equal('Tjingeling');
		});
	});
});

/*

console.log(i);

i.get('Aloha').
*/