import remoteDefinitions from './manifest.json';

export { RemoteComponent } from './remote-component';

export type RemoteDefinition = (typeof remoteDefinitions)[0];

export { remoteDefinitions };
