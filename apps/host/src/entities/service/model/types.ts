import { type Service } from '~/shared/api';

export type ServiceState = {
  services: Service[];
  isLoaded: boolean;
  setIsLoaded: (isLoaded: boolean) => void;
  fetchServices: () => Promise<void>;
};
