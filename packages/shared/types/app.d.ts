export {};

declare global {
  /**
   * Custom utility types
   */
  export type Nullable<T> = T | null;

  /**
   * Constants
   */
  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
  declare const __DEV__: boolean;

  /**
   * CSS modules support
   */
  type CSSModule = Record<string, string>;

  declare module '*.module.css' {
    const styles: CSSModule;
    export default styles;
  }

  declare module '*.png';
}
