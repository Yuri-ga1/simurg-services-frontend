import { AppShell } from '@mantine/core';
import { type FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '~/widgets/navbar';

export const BaseLayout: FC = () => (
  <AppShell padding="md" navbar={{ width: 300, breakpoint: 0 }}>
    <Navbar />
    <AppShell.Main>
      <Outlet />
    </AppShell.Main>
  </AppShell>
);
