import { type BackendServiceAction, type BackendServiceState } from './types';

export const backendServiceReducer = (
  state: BackendServiceState,
  action: BackendServiceAction,
): BackendServiceState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoaded: false };
    case 'FETCH_DONE':
      return { ...state, backendServices: action.payload, isLoaded: true };
    case 'FETCH_FAIL':
      return { ...state, isLoaded: true };
    default:
      return state;
  }
};
