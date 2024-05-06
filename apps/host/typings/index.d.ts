/// <reference types="@repo/types/declarations/react-app" />

declare type MfManifest = {
  remotes: RemoteDefinition[];
};

declare type RemoteDefinition = {
  url: string;
  name: string;
  serviceName: string;
  routePath: string;
  module: string;
};
