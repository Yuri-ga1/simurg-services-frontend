import {
  type FC,
  type PropsWithChildren,
  createContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import { notification } from '@internal/shared/lib/notification';
import { type BackendServiceState } from './types';
import { backendServiceReducer } from './reducer';
import { useStrictContext } from '../../../shared/lib/react';
import { api } from '../../../shared/api';

const INITIAL_STATE: BackendServiceState = {
  backendServices: [],
  isLoaded: false,
};

const BackendServiceStateContext = createContext<BackendServiceState>(INITIAL_STATE);
BackendServiceStateContext.displayName = 'BackendServiceContext';

export const useBackendServiceState = (): BackendServiceState =>
  useStrictContext(BackendServiceStateContext);

export const BackendServiceProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(backendServiceReducer, INITIAL_STATE);

  const loadBackendServices = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: 'FETCH_START' });
      const services = await api.getBackendServices();
      dispatch({ type: 'FETCH_DONE', payload: services });
    } catch {
      dispatch({ type: 'FETCH_FAIL' });
      notification.error({
        title: 'Ошибка!',
        message: 'Произошла ошибка при загрузке сервисов 😔',
      });
    }
  }, []);

  useEffect(() => {
    loadBackendServices();
  }, [loadBackendServices]);

  return (
    <BackendServiceStateContext.Provider value={state}>
      {children}
    </BackendServiceStateContext.Provider>
  );
};
