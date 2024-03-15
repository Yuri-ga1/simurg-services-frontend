import { Center, Loader } from '@mantine/core';
import { type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useServiceState, useServiceAccessGuard } from '../../entities/service';
import { Navbar } from '../../widgets/navbar';
import { AppShell } from '../../shared/ui';

export const ServiceLayout: FC = () => {
  useServiceAccessGuard();
  const { isLoaded } = useServiceState();

  return (
    <AppShell navbar={<Navbar />}>
      {isLoaded ? (
        <Outlet />
      ) : (
        <Center maw="100%" mih="inherit">
          <Loader />
        </Center>
      )}
    </AppShell>
  );
};
