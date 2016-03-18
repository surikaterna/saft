const ownKeys = (global.Reflect !== undefined && Reflect.ownKeys) ? Reflect.ownKeys : (o) => {
  let keys = Object.getOwnPropertyNames(o);
  if (Object.getOwnPropertySymbols) {
  	return keys.concat(Object.getOwnPropertySymbols(o));
  }
  return keys;
};

const hasFunction = o => {
	return false;
}

export default {hasFunction, ownKeys};