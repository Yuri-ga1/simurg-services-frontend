import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { remoteDefinitions } from '~/shared/config/module-federation';
import { ROUTES } from '~/shared/config/routes';
import { useServiceStore } from '../model/store';

export const useServiceAccessGuard = (): void => {
  const { services, isLoaded } = useServiceStore();
  const location = useLocation();
  const navigate = useNavigate();

  const existingDefinition = remoteDefinitions.find((definition) =>
    location.pathname.includes(definition.routePath),
  );

  useEffect(() => {
    if (isLoaded && existingDefinition) {
      const existingService = services.find(
        (service) => service.name === existingDefinition.serviceName,
      );
      if (existingService?.['status-code'] !== 200) {
        navigate(ROUTES.home);
      }
    }
  }, [existingDefinition, isLoaded, navigate, services]);
};
