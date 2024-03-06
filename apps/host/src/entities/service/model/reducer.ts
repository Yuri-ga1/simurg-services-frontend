import { type ServiceState, type ServiceAction } from './types';

export const serviceReducer = (state: ServiceState, action: ServiceAction): ServiceState => {
  switch (action.type) {
    case 'FETCH':
      return { ...state, isLoaded: false };
    case 'FETCH_SUCCESS':
      return { ...state, services: action.payload, isLoaded: true };
    case 'FETCH_FAIL':
      return { ...state, isLoaded: true };
    default:
      return state;
  }
};
