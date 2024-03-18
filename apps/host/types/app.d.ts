/// <reference types="@repo/types/react-app" />

export {};

declare global {
  export type RemoteDefinition = {
    url: string;
    name: string;
    backendName: string;
    routePath: string;
  };

  declare module '*/module-federation.manifest.json' {
    const remoteDefinitions: RemoteDefinition[];
    export default remoteDefinitions;
  }
}
