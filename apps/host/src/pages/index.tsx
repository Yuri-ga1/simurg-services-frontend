import { type RouteObject, createBrowserRouter, Navigate } from 'react-router-dom';
import { Title, Loader, Divider } from '@mantine/core';
import { type FC } from 'react';
import { BackendServiceAccessGuard } from '../entities/backend-service';
import { BaseLayout } from '../layouts/base';
import { IndexPage } from './index/index';
import { remoteDefinitions, type RemoteDefinition } from '../shared/config/module-federation';
import { Page, RemoteModule } from '../shared/ui';

const RemotePage: FC<{ definition: RemoteDefinition }> = ({ definition }) => (
  <Page title={`${definition.name}`}>
    <Title>{definition.name}</Title>
    <Divider my="md" />
    <RemoteModule
      url={definition.url}
      scope={definition.name}
      module="./Module"
      fallback={<Loader />}
    />
  </Page>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <BackendServiceAccessGuard>
        <BaseLayout />
      </BackendServiceAccessGuard>
    ),
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
      ...remoteDefinitions.map(
        (d): RouteObject => ({
          path: d.routePath,
          element: <RemotePage definition={d} />,
        }),
      ),
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);
