import { useEffect, type FC } from 'react';
import { type RouteObject, createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useFetchServices } from '~/entities/service';
import { BaseLayout } from '~/layouts/base';
import { ServiceLayout } from '~/layouts/service';
import { REMOTE_DEFINITIONS } from '~/shared/config/module-federation';
import { ROUTES } from '~/shared/config/routes';
import { RemoteModulePage } from '~/shared/ui';
import { IndexPage } from './index/index';

const OnInit: FC = () => {
  const fetchServices = useFetchServices();

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    element: <OnInit />,
    children: [
      {
        element: <BaseLayout />,
        children: [
          {
            path: ROUTES.home,
            element: <IndexPage />,
          },
        ],
      },
      {
        element: <ServiceLayout />,
        children: [
          ...REMOTE_DEFINITIONS.map(
            (definition): RouteObject => ({
              path: definition.routePath,
              element: <RemoteModulePage definition={definition} />,
            }),
          ),
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.home} />,
  },
]);
