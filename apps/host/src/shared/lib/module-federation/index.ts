import { MFE_DOMAIN } from '~/shared/config/env';

export { RemoteModule } from './remote-module';

export type RawRemoteDefinition = {
  name: string;
  port: number;
  backendName: string;
};

export type RemoteDefinition = {
  url: string;
  name: string;
  backendName: string;
  path: string;
};

// eslint-disable-next-line import/no-mutable-exports
export let remoteDefinitions: RemoteDefinition[] = [];

export const setRemoteDefinitions = (definitions: RawRemoteDefinition[]): void => {
  const transformed: RemoteDefinition[] = definitions.map((definition) => ({
    ...definition,
    url: [__DEV__ ? 'http://localhost' : MFE_DOMAIN, definition.port].join(':'),
    path: definition.name.toLowerCase(),
  }));
  remoteDefinitions = transformed;
};
