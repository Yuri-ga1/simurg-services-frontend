import { type RouteObject, createBrowserRouter, Navigate } from 'react-router-dom';
import { Title, Loader, Divider } from '@mantine/core';
import { type FC } from 'react';
import { BaseLayout } from '../layouts/base';
import { IndexPage } from './index/index';
import { remoteDefinitions } from '../shared/config/remote-definitions';
import { Page, RemoteComponent } from '../shared/ui';
import { ServiceLayout } from '../layouts/service';
import { routes } from '../shared/config/routes';

type RemoteModulePageProps = {
  definition: (typeof remoteDefinitions)[0];
};

const RemoteModulePage: FC<RemoteModulePageProps> = ({ definition }) => (
  <Page title={`${definition.name}`}>
    <Title>{definition.name}</Title>
    <Divider my="md" />
    <RemoteComponent
      url={definition.url}
      scope={definition.name}
      module="./Module"
      fallback={<Loader />}
    />
  </Page>
);

export const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    children: [
      {
        path: routes.home,
        element: <IndexPage />,
      },
    ],
  },
  {
    element: <ServiceLayout />,
    children: [
      ...remoteDefinitions.map(
        (definition): RouteObject => ({
          path: definition.routePath,
          element: <RemoteModulePage definition={definition} />,
        }),
      ),
    ],
  },
  {
    path: '*',
    element: <Navigate to={routes.home} />,
  },
]);
