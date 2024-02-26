import { BaseLayout } from '~/layouts/base';
import { type FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RemoteModule, remoteDefinitions } from '~/shared/lib/module-federation';
import { Title, Divider, Loader } from '@mantine/core';
import { Page } from '~/shared/ui';
import { IndexPage } from './index/index';

export const Pages: FC = () => {
  const remoteRoutes = remoteDefinitions.map((definition) => (
    <Route
      key={definition.name}
      path={definition.name.toLowerCase()}
      element={
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
      }
    />
  ));

  return (
    <Routes>
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<IndexPage />} />
        {remoteRoutes}
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
