import { notification } from '@repo/lib/notification';
import { useMount, useStrictContext } from '@repo/lib/react';
import { type FC, type PropsWithChildren, createContext, useReducer } from 'react';
import { api } from '~/shared/api';
import { useTranslation } from '~/shared/lib/i18next';
import { serviceReducer } from './reducer';
import { type ServiceState } from './types';

const INITIAL_STATE: ServiceState = {
  services: [],
  isLoaded: false,
};

const ServiceStateContext = createContext<ServiceState>(INITIAL_STATE);
ServiceStateContext.displayName = 'ServiceStateContext';

export const useServiceState = (): ServiceState => useStrictContext(ServiceStateContext);

export const ServiceProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(serviceReducer, INITIAL_STATE);
  const { t } = useTranslation();

  const loadServices = async (): Promise<void> => {
    try {
      dispatch({ type: 'FETCH' });
      const services = await api.getServices();
      dispatch({ type: 'FETCH_SUCCESS', payload: services });
    } catch {
      dispatch({ type: 'FETCH_FAIL' });
      notification.error({
        title: t('common.error'),
        message: t('service.loadServicesError'),
      });
    }
  };

  useMount(() => {
    loadServices();
  });

  return <ServiceStateContext.Provider value={state}>{children}</ServiceStateContext.Provider>;
};
