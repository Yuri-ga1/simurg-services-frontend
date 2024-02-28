export function assert(condition: any, msg: string): asserts condition {
  if (!condition) {
    throw new Error(`Assertion Error ${msg}`);
  }
}

export const isUndefined = (val: any): val is undefined => typeof val === 'undefined';
