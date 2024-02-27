import { type FC, type PropsWithChildren, createContext, useReducer, useMemo } from 'react';
import { useStrictContext } from '~/shared/lib/react';
import { api } from '~/shared/api';
import { notification } from '@simurg-microfrontends/shared/lib/notification';
import { type BackendServiceHandlers, type BackendServiceState } from './types';
import { backendServiceReducer } from './reducer';

const INITIAL_STATE: BackendServiceState = {
  backendServices: [],
  isLoaded: false,
};

const BackendServiceStateContext = createContext<BackendServiceState>(INITIAL_STATE);
BackendServiceStateContext.displayName = 'BackendServiceContext';

export const useBackendServiceState = (): BackendServiceState =>
  useStrictContext(BackendServiceStateContext);

const BackendServiceHandlersContext = createContext<BackendServiceHandlers>({
  loadBackendServices: async () => {},
});
BackendServiceHandlersContext.displayName = 'BackendServiceHandlersContext';

export const useBackendServiceHandlers = (): BackendServiceHandlers =>
  useStrictContext(BackendServiceHandlersContext);

export const BackendServiceProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(backendServiceReducer, INITIAL_STATE);

  const handlers: BackendServiceHandlers = useMemo(
    () => ({
      loadBackendServices: async (): Promise<void> => {
        try {
          dispatch({ type: 'loading' });
          const services = await api.getBackendServices();
          dispatch({ type: 'done', payload: services });
        } catch {
          dispatch({ type: 'fail' });
          notification.error({
            title: 'Ошибка!',
            message: 'Произошла ошибка при загрузке сервисов 😔',
          });
        }
      },
    }),
    [],
  );

  return (
    <BackendServiceStateContext.Provider value={state}>
      <BackendServiceHandlersContext.Provider value={handlers}>
        {children}
      </BackendServiceHandlersContext.Provider>
    </BackendServiceStateContext.Provider>
  );
};
