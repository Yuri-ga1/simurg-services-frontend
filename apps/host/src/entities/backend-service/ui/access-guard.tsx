import { type FC, type PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useBackendServiceState } from '../model/context';
import { remoteDefinitions } from '../../../shared/config/module-federation';

export const BackendServiceAccessGuard: FC<PropsWithChildren> = ({ children }) => {
  const { backendServices, isLoaded } = useBackendServiceState();
  const { pathname } = useLocation();

  const definition = remoteDefinitions.find((d) => pathname.includes(d.routePath));

  if (!isLoaded || !definition) {
    return children;
  }

  const isActive = backendServices.find(
    (s) => s.name === definition.backendName && s['status-code'] === 200,
  );

  return isActive ? children : <Navigate to="/" />;
};
