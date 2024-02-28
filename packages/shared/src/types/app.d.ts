/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
export {};

declare global {
  /**
   * Custom utility types
   */
  export type Nullable<T> = T | null;

  /**
   * Constants
   */
  declare const __DEV__: boolean;

  /**
   * Recourses support
   */
  type CSSModule = Record<string, string>;
  declare module '*.module.css' {
    const styles: CSSModule;
    export default styles;
  }

  declare module '*.png';
}
