/// <reference path="util-types.d.ts" />

export {};

declare global {
  /**
   * Resources support
   */
  export type CSSModule = Record<string, string>;

  declare module '*.module.css' {
    const styles: CSSModule;
    export default styles;
  }

  declare module '*.png';
}
