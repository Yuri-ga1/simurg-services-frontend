import { type BackendServiceAction, type BackendServiceState } from './types';

export const backendServiceReducer = (
  state: BackendServiceState,
  action: BackendServiceAction,
): BackendServiceState => {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoaded: false };
    case 'done':
      return { ...state, backendServices: action.payload, isLoaded: true };
    case 'fail':
      return { ...state, isLoaded: true };
    default:
      return state;
  }
};
