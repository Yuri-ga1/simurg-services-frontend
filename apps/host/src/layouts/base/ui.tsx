import { AppShell, Center, Loader } from '@mantine/core';
import { type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useBackendServiceState } from '../../entities/backend-service';
import { Navbar } from '../../widgets/navbar';

export const BaseLayout: FC = () => {
  const { isLoaded } = useBackendServiceState();

  return (
    <AppShell padding="md" navbar={{ width: 300, breakpoint: 0 }}>
      <Navbar />
      <AppShell.Main>
        {isLoaded ? (
          <Outlet />
        ) : (
          <Center maw="100%" mih="inherit">
            <Loader />
          </Center>
        )}
      </AppShell.Main>
    </AppShell>
  );
};
