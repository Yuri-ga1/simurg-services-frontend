export type RemoteDefinition = {
  url: string;
  name: string;
  backendName: string;
  routePath: string;
};

export const remoteDefinitions: RemoteDefinition[] = [
  {
    url: 'http://localhost:9001',
    name: 'Navi',
    backendName: 'navi',
    routePath: 'navi',
  },
];
