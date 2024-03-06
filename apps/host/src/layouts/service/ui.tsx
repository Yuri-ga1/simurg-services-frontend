import { Center, Loader } from '@mantine/core';
import { type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useServiceState, withServiceAccessGuard } from '../../entities/service';
import { Navbar } from '../../widgets/navbar';
import { AppShell } from '../../shared/ui';

const InternalServiceLayout: FC = () => {
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

export const ServiceLayout = withServiceAccessGuard(InternalServiceLayout);
