if (!Reflect || !Reflect.getMetadata) {
  throw new Error('You need to import "reflect-metadata" at the very first line of your application.');
}

export * from './decorators';
export * from './Injector';
export { ListBinder } from './binder';
export * from './provider';
