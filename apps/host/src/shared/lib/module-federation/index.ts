export { RemoteComponent } from './remote-component';

export type RemoteModule = {
  id: string;
  url: string;
  name: string;
  backendName: string;
};

// eslint-disable-next-line import/no-mutable-exports
export let remoteModules: RemoteModule[] = [];

export const setRemoteModules = (modules: RemoteModule[]): void => {
  remoteModules = modules;
};
