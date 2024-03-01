import {
  type FC,
  type PropsWithChildren,
  createContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import { notification } from '@internal/shared/lib/notification';
import { type ServiceState } from './types';
import { serviceReducer } from './reducer';
import { useStrictContext } from '../../../shared/lib/react';
import { api } from '../../../shared/api';

const INITIAL_STATE: ServiceState = {
  services: [],
  loaded: false,
};

const ServiceStateContext = createContext<ServiceState>(INITIAL_STATE);
ServiceStateContext.displayName = 'ServiceStateContext';

export const useServiceState = (): ServiceState => useStrictContext(ServiceStateContext);

export const ServiceProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(serviceReducer, INITIAL_STATE);

  const loadServices = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      const services = await api.getServices();
      dispatch({ type: 'FETCH_DONE', payload: services });
    } catch {
      dispatch({ type: 'FETCH_FAIL' });
      notification.error({
        title: 'Error!',
        message: 'There was an error while loading services 😔',
      });
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  return <ServiceStateContext.Provider value={state}>{children}</ServiceStateContext.Provider>;
};
