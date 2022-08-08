# Saft

[Saft](https://github.com/surikaterna/saft) is a lightweight Dependency Injection (DI) Framework for TypeScript &
JavaScript. It is based on ES2015/ES2017 features such as decorators.

* [Purpose](#purpose)
* [Installation](#installation)
* [Usage](#usage-example)
* [Decorators](#decorators)
    * [@Provides](#provides)
    * [@Promises](#promises)
    * [@ProvidesToList](#providestolist)
    * [@ProvidesToMap](#providestomap)
    * [@Promises](#promises)
    * [@Singleton](#singleton)
    * [@EagerSingleton](#eagersingleton)
    * [@Inject](#inject)

## Purpose

Allow dynamic extensions to application both in server (node) code as well as client (browserify, webpack) code.

## Installation

```shell
npm install --save saft
```

## Usage Example

Create module classes that provides values to an Injectors DI context. Then access the bound values from the injector.

```typescript
// DbModule.ts
import { DB } from './DB';

export class DbModule {
  @Promises('db')
  getDb() {
    return new DB();
  }
}

// UserModule.ts
import { DB } from '../db/DB';
import { User } from './User';

export interface GetUserById {
  (user: User): Promise<User>;
}

export class UserModule {
  @Provides('getUserById')
  @Inject('db')
  createGetUserById(db: DB) {
    return (id: string) => db.findById(id);
  }
}

// injector.ts
import { Injector } from 'saft';
import { DbModule } from './user/DbModule';
import { UserModule } from './user/UserModule';

class InjectorSingleton {
  static instance?: Injector;
  static isResolved = false;

  static getInjector(): Injector {
    if (InjectorSingleton.instance) {
      return InjectorSingleton.instance;
    }

    const injector = new Injector(
      new DbModule(),
      new UserModule()
    );

    InjectorSingleton.instance = injector;
    return injector;
  }
}

export default InjectorSingleton.getInjector();

// bootstrap.ts
function bootstrap() {
  /**
   * Run any services
   * Bound values will be accessible through the injector singleton
   *
   * const getUserById = injector.get<GetUserById>('getUserById');
   * const user = await getUserById('123');
   */
}

export default bootstrap;

// index.ts
import bootstrap from './bootstrap';
import injector from './modules/injector';

// Run application when all modules are ready to be consumed
injector.once('ready', bootstrap);
```

## Decorators

### @Provides

Used with Module classes to create a binding for a function that returns a value

```typescript
class DbModule {
  @Provides('db')
  getDb() {
    return new DB();
  }
}

// Injector know how to create instances of DB with the key 'db'
const injector = new Injector(new MyModule());
```

### @Promises

Used with Module classes to create a binding for a function that instead of the value returns a promise of the value.
This is used when the value should be injected instead of the promise to the "consuming" function.

```typescript
class DbModule {
  @Promises('db')
  getDb() {
    return Promise.resolve(new DB());
  }
}

// Injector will cache the resolved value and return the DB instance when 'db' is injected
const injector = new Injector(new DbModule());
```

### @ProvidesToList

> TODO: Write description

### @ProvidesToMap

> TODO: Write description

### @Singleton

Used to ensure single instance of the provided value.

```typescript
class DbModule {
  @Provides('db')
  @Singleton()
  getDb() {
    return new DB();
  }
}

/**
 * Injector will only initialize DB once
 * The same instance will be provided every time 'db' is injected
 */
const injector = new Injector(new DbModule());
```

### @EagerSingleton

> TODO: Write description

### @Inject

Decorate a function to make the injected values into arguments.

```typescript
class DbModule {
  @Promises('db')
  @Singleton
  getDb() {
    return Promise.resolve(new DB());
  }

  @Provides('validate')
  getValidator() {
    return (entity: Entity) => {
      if (!entity.id) {
        throw new Error('Data is invalid');
      }
    };
  }
}

class UserModule {
  @Provides('addUser')
  // Inject multiple values
  @Inject('db', 'validate')
  getAddUser(db: DB, validate: Validate) {
    return (user: User) => {
      try {
        this.validate(user);
        this.db.insert(user);
      } catch (error) {
        // Handle validation error
      }
    }
  }
}

type AddUserFunc = ReturnType<UserModule['getAddUser']>;

// Use injector.get to access bound values
injector.get<AddUserFunc>('addUser').then((addUser) => {
  // Will validate data and inserting into the database if valid
  addUser(userData);
});
```
