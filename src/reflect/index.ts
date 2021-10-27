const customOwnKeys: typeof Reflect['ownKeys'] = (obj) => {
  const keys: Array<string | symbol> = Object.getOwnPropertyNames(obj);

  if (Object.getOwnPropertySymbols) {
    return keys.concat(Object.getOwnPropertySymbols(obj));
  }

  return keys;
};

const ownKeys: typeof Reflect['ownKeys'] = Reflect?.ownKeys ?? customOwnKeys;

const hasFunction = (obj: unknown): obj is Function => {
  return typeof obj === 'function';
};

export default { hasFunction, ownKeys };
