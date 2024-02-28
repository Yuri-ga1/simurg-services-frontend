import { type BackendService } from '../../../shared/api';

export type BackendServiceState = {
  backendServices: BackendService[];
  isLoaded: boolean;
};

export type BackendServiceAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_DONE'; payload: BackendService[] }
  | { type: 'FETCH_FAIL' };
