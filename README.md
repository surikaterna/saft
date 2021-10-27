# About Saft
[Saft](https://github.com/surikaterna/saft) is a lightweight Dependency Injection Framework
DI for JS, almost as good as juice but a lot cheaper... It is based on ES2015/ES2017 features such as decorators.

## Purpose
Allow dynamic extensions to application both in server (node) code as well as client (browserify, webpack) code.

## Installation
```bash
npm install --save saft
```

## Annotations / Decorators
### @Provides
Used with Module classes to create a binding for a function that returns a value
```javascript
class MyModule {
    @Provides('my-db')
    getDb() {
    	return new Db();
    }
}

//Injector know how to create instances of DB with the key 'my-db'
new Injector(new MyModule());

```

### @Singleton
Used to ensure single instance
```javascript
class MyModule {
    @Provides('my-db')
    @Singleton()
    getDb() {
    	return new Db();
    }
}

//Injector now we always get the same instance when @injecting key 'my-db'
new Injector(new MyModule());

```

### @Promises
Used with Module classes to create a binding for a function that instead of the instance returns a promise of the instance. This is used when the value should be injected instead of the promise to the "consuming" function.

```javascript
class MyModule {
	@Promises('my-db')
    getDb() {
    	return Promise.resolve(new Db());
    }
}

//Injector know how to create instances of DB with the key 'my-db'
new Injector(new MyModule());

```

### @Inject
Put on a class to show that in expects things to be injected

```javascript
class MyModule {
    @Promises('my-db')
    getDb() {
    	return Promise.resolve(new Db());
    }
}

@Inject('my-db')
class Consumer {
    constructor(db) {
    }
}
//Injector know how to create instances of DB with the key 'my-db'
new Injector(new MyModule());
```



## Examples

# Upgrade Guide

- [x] Replace Mocha & Should with Jest
- [x] Upgrade ESLint and Babel dependencies
- [x] ~~Replace bluebird with vanilla promises?~~
  - Since we're using Promise utilities from bluebird, we might keep it
- [ ] Add warning for missing reflect-metadata dependency
- [ ] Add TypeScript support
- [ ] Update documentation
