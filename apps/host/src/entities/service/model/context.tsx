import {
  type FC,
  type PropsWithChildren,
  createContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';
import { notification } from '@repo/lib/notification';
import { type ServiceState } from './types';
import { serviceReducer } from './reducer';
import { useStrictContext } from '../../../shared/lib/react';
import { api } from '../../../shared/api';
import { useTranslation } from '../../../shared/lib/i18next';

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

  const loadServices = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: 'FETCH' });
      const services = await api.getServices();
      dispatch({ type: 'FETCH_SUCCESS', payload: services });
    } catch {
      dispatch({ type: 'FETCH_FAIL' });
      notification.error({
        title: `${t('common.error')}!`,
        message: `${t('service.loadServicesError')} 😔`,
      });
    }
  }, [t]);

  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <ServiceStateContext.Provider value={state}>{children}</ServiceStateContext.Provider>;
};
