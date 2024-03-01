import { AppShell, Code, Group, Title, Tooltip, Text } from '@mantine/core';
import { type PropsWithChildren, type FC } from 'react';
import { NavLink, type To } from 'react-router-dom';
import { isUndefined } from '@internal/shared/lib/typescript';
import { useServiceState } from '../../../entities/service';
import styles from './styles.module.css';
import { remoteDefinitions } from '../../../shared/lib/module-federation';
import { SkeletonList } from '../../../shared/ui';

const NavbarLink: FC<PropsWithChildren<{ to: To }>> = ({ to, children }) => (
  <NavLink className={({ isActive }) => [styles.link, isActive && styles.active].join(' ')} to={to}>
    {children}
  </NavLink>
);

export const Navbar: FC = () => {
  const { services, loaded } = useServiceState();

  const data: { label: string; to: To; isActive?: boolean }[] = [
    {
      label: 'Home',
      to: '/',
    },
    ...remoteDefinitions.map((d) => ({
      label: d.name,
      to: d.routePath,
      isActive: services.some((s) => s.name === d.backendName && s['status-code'] === 200),
    })),
  ];

  const links = data.map((item) =>
    !isUndefined(item.isActive) && !item.isActive ? (
      <Tooltip key={item.label} label="Service is temporarily unavailable">
        <Text className={styles.link}>{item.label}</Text>
      </Tooltip>
    ) : (
      <NavbarLink key={item.label} to={item.to}>
        {item.label}
      </NavbarLink>
    ),
  );

  return (
    <AppShell.Navbar className={styles.navbar}>
      <div className={styles.navbarMain}>
        <Group className={styles.header} justify="space-between">
          <Title order={3}>SIMuRG Services</Title>
          <Code fw={700}>v0.0.1</Code>
        </Group>
        {loaded ? links : <SkeletonList count={5} itemProps={{ h: 32, mt: 'sm' }} />}
      </div>
    </AppShell.Navbar>
  );
};
