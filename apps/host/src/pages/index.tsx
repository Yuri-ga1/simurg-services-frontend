import { BaseLayout } from '~/layouts/base';
import { type FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { RemoteComponent, remoteModules } from '~/shared/lib/module-federation';
import { Title, Divider, Loader } from '@mantine/core';
import { Page } from '~/shared/ui';
import { IndexPage } from './index/index';

export const Pages: FC = () => {
  const mfeRoutes = remoteModules.map((remote) => (
    <Route
      key={remote.id}
      path={remote.name.toLowerCase()}
      element={
        <Page title={`${remote.name}`}>
          <Title>{remote.name}</Title>
          <Divider my="md" />
          <RemoteComponent
            url={remote.url}
            scope={remote.name}
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
        {mfeRoutes}
      </Route>
    </Routes>
  );
};
