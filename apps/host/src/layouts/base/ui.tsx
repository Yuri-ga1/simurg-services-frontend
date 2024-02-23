import { AppShell, Skeleton } from '@mantine/core';
import { type FC } from 'react';
import { Outlet } from 'react-router-dom';

export const BaseLayout: FC = () => (
  <AppShell p="md" navbar={{ width: 300, breakpoint: 0 }}>
    <AppShell.Navbar p="md">
      Navbar
      {Array(6)
        .fill(0)
        .map((_, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <Skeleton key={idx} h={28} mt="sm" />
        ))}
    </AppShell.Navbar>
    <AppShell.Main>
      <Outlet />
    </AppShell.Main>
  </AppShell>
);
