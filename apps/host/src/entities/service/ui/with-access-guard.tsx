import { type ReactNode, type FC, type PropsWithChildren, type ComponentType } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useServiceState } from '../model/context';
import { remoteDefinitions } from '../../../shared/lib/module-federation';
import { routes } from '../../../shared/config/routes';

const ServiceAccessGuard: FC<PropsWithChildren> = ({ children }) => {
  const { services, isLoaded } = useServiceState();
  const location = useLocation();

  const existingDefinition = remoteDefinitions.find((definition) =>
    location.pathname.includes(definition.routePath),
  );
  if (!isLoaded || !existingDefinition) {
    return children;
  }

  const isServiceActive = services.find(
    (service) => service.name === existingDefinition.backendName && service['status-code'] === 200,
  );

  return isServiceActive ? children : <Navigate to={routes.home} />;
};

export const withServiceAccessGuard = (WrappedComponent: ComponentType) => (): ReactNode => (
  <ServiceAccessGuard>
    <WrappedComponent />
  </ServiceAccessGuard>
);
