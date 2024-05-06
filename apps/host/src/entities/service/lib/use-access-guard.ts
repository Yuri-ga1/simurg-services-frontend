import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mfManifest } from '~/shared/config/module-federation';
import { ROUTES } from '~/shared/config/routes';
import { useServiceStore } from '../model/store';

export const useServiceAccessGuard = (): void => {
  const { services, isLoaded } = useServiceStore();
  const location = useLocation();
  const navigate = useNavigate();

  const existingRemote = mfManifest.remotes.find((remote) =>
    location.pathname.includes(remote.routePath),
  );

  useEffect(() => {
    if (isLoaded && existingRemote) {
      const existingService = services.find(
        (service) => service.name === existingRemote.serviceName,
      );
      if (existingService?.['status-code'] !== 200) {
        navigate(ROUTES.home);
      }
    }
  }, [existingRemote, isLoaded, navigate, services]);
};
