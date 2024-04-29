import { notification } from '@repo/lib/notification';
import { create } from 'zustand';
import { api } from '~/shared/api';
import { useTranslation } from '~/shared/lib/i18next';
import { type ServiceState } from './types';

export const useServiceStore = create<ServiceState>((set) => ({
  services: [],
  isLoaded: false,
  setIsLoaded: (isLoaded): void => set({ isLoaded }),
  fetchServices: async (): Promise<void> => {
    const services = await api.getServices();
    set({ services });
  },
}));

export const useServiceFetch = (): (() => Promise<void>) => {
  const { t } = useTranslation();
  const { fetchServices, setIsLoaded } = useServiceStore();

  return async () => {
    try {
      setIsLoaded(false);
      await fetchServices();
      setIsLoaded(true);
    } catch {
      setIsLoaded(true);
      notification.error({
        title: t('common.error'),
        message: t('service.loadServicesError'),
      });
    }
  };
};
