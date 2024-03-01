import { type ServiceState, type ServiceAction } from './types';

export const serviceReducer = (state: ServiceState, action: ServiceAction): ServiceState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loaded: false };
    case 'FETCH_DONE':
      return { ...state, services: action.payload, loaded: true };
    case 'FETCH_FAIL':
      return { ...state, loaded: true };
    default:
      return state;
  }
};
