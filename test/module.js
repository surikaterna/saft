import { Provides, Inject } from '../lib/decorators'
import { Injector } from '../lib/injector'

@Inject('asas', 'bbb')
class MyModule {
  constructor(a) {
    
  }
//  @Provides('Aloha')
//  @Inject('ibb', 'icc')
  getAloha(bb, cc) {
    return 'Tjingeling'
  }
}
/*
describe('Injector', function() {
	describe('Provides', function() {
		it('should return correct instance', function() {
			let injector = new Injector(new MyModule());
			injector.get('Aloha').should.equal('Tjingeling');
		});
	});
});
*/
/*

console.log(i);

i.get('Aloha').
*/