export const isArray = (obj: unknown): boolean => Array.isArray(obj);

export const error = (msg: string): void => {
  return console.error(msg);
};
