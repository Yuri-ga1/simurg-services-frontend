import { type FC, type PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { remoteDefinitions } from '~/shared/lib/module-federation';
import { useBackendServiceState } from '../model/context';

export const BackendServiceAccessGuard: FC<PropsWithChildren> = ({ children }) => {
  const { backendServices, isLoaded } = useBackendServiceState();
  const { pathname } = useLocation();

  const mfe = remoteDefinitions.find((definition) => pathname.includes(definition.path));

  if (!isLoaded || !mfe) {
    return children;
  }

  const isActive = backendServices.find(
    (service) => service.name === mfe.backendName && service['status-code'] === 200,
  );

  return isActive ? children : <Navigate to="/" />;
};
