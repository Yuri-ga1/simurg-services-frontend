/// <reference path="util-types.d.ts" />

declare module '*.module.css' {
  const styles: Record<string, string>;
  export default styles;
}

declare module '*.png';
