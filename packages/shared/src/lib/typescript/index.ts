export function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Assertion Error ${message}`);
  }
}

export const isUndefined = (value: any): value is undefined => typeof value === 'undefined';