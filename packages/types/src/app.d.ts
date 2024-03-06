/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/// <reference path="custom.d.ts" />

export {};

declare global {
  /**
   * Constants
   */
  export const __DEV__: boolean;

  export const APP_NAME: string;

  /**
   * Resources support
   */
  type CSSModule = Record<string, string>;
  declare module '*.module.css' {
    const styles: CSSModule;
    export default styles;
  }

  declare module '*.png';
}
