import { AppShell, Center, Loader } from '@mantine/core';
import { type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useServiceState } from '../../entities/service';
import { Navbar } from '../../widgets/navbar';

export const BaseLayout: FC = () => {
  const { loaded } = useServiceState();

  return (
    <AppShell padding="md" navbar={{ width: 300, breakpoint: 0 }}>
      <Navbar />
      <AppShell.Main>
        {loaded ? (
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
