/// <reference types="@repo/types/react-app" />

declare global {
  export type RemoteDefinition = {
    url: string;
    name: string;
    serviceName: string;
    routePath: string;
    module: string;
  };

  declare module '*/module-federation.manifest.json' {
    const remoteDefinitions: RemoteDefinition[];
    export default remoteDefinitions;
  }
}

export {};
