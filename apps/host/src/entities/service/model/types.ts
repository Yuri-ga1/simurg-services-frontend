import { type Service } from '../../../shared/api';

export type ServiceState = {
  services: Service[];
  isLoaded: boolean;
};

export type ServiceAction =
  | { type: 'FETCH' }
  | { type: 'FETCH_SUCCESS'; payload: Service[] }
  | { type: 'FETCH_FAIL' };
