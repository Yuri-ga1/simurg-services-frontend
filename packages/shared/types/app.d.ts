export {};

declare global {
  /**
   * Custom utility types
   */
  export type Nullable<T> = T | null;

  type CSSModule = Record<string, string>;

  declare module '*.module.css' {
    const styles: CSSModule;
    export default styles;
  }

  declare module '*.png';
}
