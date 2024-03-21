import { type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from '~/shared/ui';
import { Navbar } from '~/widgets/navbar';

export const BaseLayout: FC = () => (
  <AppShell navbar={<Navbar />}>
    <Outlet />
  </AppShell>
);
