/**
 * 
 */
export type Dictionary<V = any> = Record<string, V>;

/**
 * Test whether or not a value is an object.
 * @param value
 */
 export function isObj(value: unknown): value is Dictionary {
  return typeof value === "object" && doesExist(value);
}

/**
 * A helper function for testing whether or not a value exists.
 * @param value
 */
export function doesExist(value: unknown): boolean {
  return value !== undefined && value !== void 0;
}
