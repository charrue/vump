export const isArray = (obj: unknown): boolean => Array.isArray(obj);

export function error(msg: string): void {
  return console.error(msg);
}
