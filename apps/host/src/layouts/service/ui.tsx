import { Center, Loader } from '@mantine/core';
import { type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useServiceStore, useServiceAccessGuard } from '~/entities/service';
import { AppShell } from '~/shared/ui/app-shell';
import { Navbar } from '~/widgets/navbar';

export const ServiceLayout: FC = () => {
  useServiceAccessGuard();
  const { isLoaded } = useServiceStore();

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
