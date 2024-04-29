import { type RouteObject, createBrowserRouter, Navigate } from 'react-router-dom';
import { BaseLayout } from '~/layouts/base';
import { ServiceLayout } from '~/layouts/service';
import { REMOTE_DEFINITIONS } from '~/shared/config/module-federation';
import { ROUTES } from '~/shared/config/routes';
import { RemoteModulePage } from '~/shared/ui';
import { IndexPage } from './index/index';

export const router = createBrowserRouter([
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
  {
    path: '*',
    element: <Navigate to={ROUTES.home} />,
  },
]);
