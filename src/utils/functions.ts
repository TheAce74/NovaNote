export const getKeys = (obj: Record<string, unknown>): string[] => {
  return Object.keys(obj);
};

export const removeKey = <T extends object, K extends keyof T>(
  obj: T,
  key: K
): Partial<T> => {
  const newObj = { ...obj };
  if (key in newObj) {
    delete newObj[key];
  }
  return newObj;
};
