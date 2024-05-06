/// <reference types="@repo/types/react-app" />

type MfManifest = {
  remotes: RemoteDefinition[];
};

type RemoteDefinition = {
  url: string;
  name: string;
  serviceName: string;
  routePath: string;
  module: string;
};
