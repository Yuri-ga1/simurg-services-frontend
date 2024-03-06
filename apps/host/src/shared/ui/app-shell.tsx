import { type ReactNode, type FC, type PropsWithChildren } from 'react';
import { AppShell as MantineAppShell } from '@mantine/core';

type AppShellProps = PropsWithChildren<{ navbar: ReactNode }>;

export const AppShell: FC<AppShellProps> = ({ children, navbar }) => (
  <MantineAppShell padding="md" navbar={{ width: 300, breakpoint: 0 }}>
    {navbar}
    <MantineAppShell.Main>{children}</MantineAppShell.Main>
  </MantineAppShell>
);
