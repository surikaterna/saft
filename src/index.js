module.exports = {
  Provides: require('./decorators').Provides,
  Inject: require('./decorators').Inject,
  Provider: require('./decorators').Provider,
  Singleton: require('./decorators').Singleton,
  EagerSingleton: require('./decorators').EagerSingleton,
  Promises: require('./decorators').Promises,
  Injector: require('./injector').Injector,
  ProvidesToList: require('./decorators').ProvidesToList,
  ProvidesToMap: require('./decorators').ProvidesToMap,
  ListBinder: require('./binder/list_binder').ListBinder,
};
