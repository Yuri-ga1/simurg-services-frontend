import { AppShell, Code, Group, Title, Skeleton, Tooltip, Text } from '@mantine/core';
import { type FC } from 'react';
import { NavLink, type To } from 'react-router-dom';
import { isUndefined } from '@simurg-microfrontends/shared/lib/typescript';
import { useBackendServiceState } from '../../../entities/backend-service';
import styles from './styles.module.css';
import { remoteDefinitions } from '../../../shared/config/module-federation';

const LinkListSkeleton: FC = () =>
  Array(5)
    .fill(0)
    // eslint-disable-next-line react/no-array-index-key
    .map((_, idx) => <Skeleton key={idx} h={32} mt="sm" />);

export const Navbar: FC = () => {
  const { backendServices, isLoaded } = useBackendServiceState();

  const data: { label: string; to: To; isActive?: boolean }[] = [
    {
      label: 'Главная',
      to: '/',
    },
    ...remoteDefinitions.map((d) => ({
      label: d.name,
      to: d.routePath,
      isActive: backendServices.some((s) => s.name === d.backendName && s['status-code'] === 200),
    })),
  ];

  const links = data.map((item) =>
    !isUndefined(item.isActive) && !item.isActive ? (
      <Tooltip key={item.label} label="Сервис временно не доступен">
        <Text className={styles.link}>{item.label}</Text>
      </Tooltip>
    ) : (
      <NavLink
        key={item.label}
        className={({ isActive }) => [styles.link, isActive && styles.active].join(' ')}
        to={item.to}
      >
        {item.label}
      </NavLink>
    ),
  );

  return (
    <AppShell.Navbar className={styles.navbar}>
      <div className={styles.navbarMain}>
        <Group className={styles.header} justify="space-between">
          <Title order={3}>SIMuRG Services</Title>
          <Code fw={700}>v0.0.1</Code>
        </Group>
        {isLoaded ? links : <LinkListSkeleton />}
      </div>
    </AppShell.Navbar>
  );
};
