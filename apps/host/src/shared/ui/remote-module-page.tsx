import { Divider, Loader, Title } from '@mantine/core';
import { type FC } from 'react';
import { PageShell } from './page-shell';
import { RemoteComponent } from './remote-component';

type RemoteModulePageProps = {
  remote: RemoteDefinition;
};

export const RemoteModulePage: FC<RemoteModulePageProps> = ({ remote }) => (
  <PageShell documentTitle={`${remote.name}`}>
    <Title>{remote.name}</Title>
    <Divider my="md" />
    <RemoteComponent
      url={remote.url}
      scope={remote.name}
      module={remote.module}
      remoteEntryFileName="js/remoteEntry.js"
      fallback={<Loader />}
    />
  </PageShell>
);
