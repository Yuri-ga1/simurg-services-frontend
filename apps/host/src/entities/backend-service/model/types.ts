import { type BackendService } from '~/shared/api';

export type BackendServiceState = {
  backendServices: BackendService[];
  isLoaded: boolean;
};

export type BackendServiceHandlers = {
  loadBackendServices: () => Promise<void>;
};

export type BackendServiceAction =
  | { type: 'loading' }
  | { type: 'done'; payload: BackendService[] }
  | { type: 'fail' };
