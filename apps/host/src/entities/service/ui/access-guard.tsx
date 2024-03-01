import { type FC, type PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useServiceState } from '../model/context';
import { remoteDefinitions } from '../../../shared/lib/module-federation';

export const ServiceAccessGuard: FC<PropsWithChildren> = ({ children }) => {
  const { services, loaded } = useServiceState();
  const location = useLocation();

  const definition = remoteDefinitions.find((d) => location.pathname.includes(d.routePath));
  if (!loaded || !definition) {
    return children;
  }

  const active = services.find(
    (s) => s.name === definition.backendName && s['status-code'] === 200,
  );

  return active ? children : <Navigate to="/" />;
};
