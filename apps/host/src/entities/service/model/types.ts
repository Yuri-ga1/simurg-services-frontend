import { type Service } from '../../../shared/api';

export type ServiceState = {
  services: Service[];
  loaded: boolean;
};

export type ServiceAction =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_DONE'; payload: Service[] }
  | { type: 'FETCH_FAIL' };
