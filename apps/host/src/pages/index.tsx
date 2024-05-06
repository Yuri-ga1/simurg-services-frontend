import { useEffect, type FC } from 'react';
import { type RouteObject, createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useFetchServices } from '~/entities/service';
import { BaseLayout } from '~/layouts/base';
import { ServiceLayout } from '~/layouts/service';
import { mfManifest } from '~/shared/config/module-federation';
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
          ...mfManifest.remotes.map(
            (remote): RouteObject => ({
              path: remote.routePath,
              element: <RemoteModulePage remote={remote} />,
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
