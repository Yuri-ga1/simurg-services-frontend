import { type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../../widgets/navbar';
import { AppShell } from '../../shared/ui';

export const BaseLayout: FC = () => (
  <AppShell navbar={<Navbar />}>
    <Outlet />
  </AppShell>
);
