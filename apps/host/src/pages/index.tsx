import { BaseLayout } from '~/layouts/base';
import { type FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import {
  type RemoteDefinition,
  RemoteModule,
  remoteDefinitions,
} from '~/shared/lib/module-federation';
import { Title, Divider, Loader } from '@mantine/core';
import { Page } from '~/shared/ui';
import { BackendServiceAccessGuard } from '~/entities/backend-service';
import { IndexPage } from './index/index';

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

export const Pages: FC = () => {
  const remoteRoutes = remoteDefinitions.map((definition) => (
    <Route
      key={definition.name}
      path={definition.path}
      element={<RemotePage definition={definition} />}
    />
  ));

  return (
    <Routes>
      <Route
        path="/"
        element={
          <BackendServiceAccessGuard>
            <BaseLayout />
          </BackendServiceAccessGuard>
        }
      >
        <Route index element={<IndexPage />} />
        {remoteRoutes}
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
