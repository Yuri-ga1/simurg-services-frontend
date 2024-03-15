export function assert(condition: any, message = 'no additional info provided'): asserts condition {
  if (!condition) {
    throw new Error(`Assertion Error: ${message}`);
  }
}

export const isUndefined = (value: any): value is undefined => value === undefined;

export const isFile = (value: any): value is File => value instanceof File;
