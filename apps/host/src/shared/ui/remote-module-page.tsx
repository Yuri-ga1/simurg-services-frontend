import { Divider, Loader, Title } from '@mantine/core';
import { type FC } from 'react';
import { PageShell } from './page-shell';
import { RemoteComponent } from './remote-component';

type RemoteModulePageProps = {
  definition: RemoteDefinition;
};

export const RemoteModulePage: FC<RemoteModulePageProps> = ({ definition }) => (
  <PageShell documentTitle={`${definition.name}`}>
    <Title>{definition.name}</Title>
    <Divider my="md" />
    <RemoteComponent
      url={definition.url}
      scope={definition.name}
      module={definition.module}
      remoteEntryFileName="js/remoteEntry.js"
      fallback={<Loader />}
    />
  </PageShell>
);
