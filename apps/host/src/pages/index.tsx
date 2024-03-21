import { Title, Divider, Loader } from '@mantine/core';
import { type FC } from 'react';
import { type RouteObject, createBrowserRouter, Navigate } from 'react-router-dom';
import { BaseLayout } from '~/layouts/base';
import { ServiceLayout } from '~/layouts/service';
import { routes } from '~/shared/config/routes';
import { Page, RemoteComponent } from '~/shared/ui';
import remoteDefinitions from '/module-federation.manifest.json';
import { IndexPage } from './index/index';

type RemoteModulePageProps = {
  definition: RemoteDefinition;
};

const RemoteModulePage: FC<RemoteModulePageProps> = ({ definition }) => (
  <Page title={`${definition.name}`}>
    <Title>{definition.name}</Title>
    <Divider my="md" />
    <RemoteComponent
      url={definition.url}
      scope={definition.name}
      module="./Module"
      remoteEntryFileName="js/remoteEntry.js"
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
