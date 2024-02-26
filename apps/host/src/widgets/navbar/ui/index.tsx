import { AppShell, Code, Group, Title } from '@mantine/core';
import { type FC } from 'react';
import { NavLink, type To } from 'react-router-dom';
import { remoteDefinitions } from '~/shared/lib/module-federation';
import styles from './styles.module.css';

export const Navbar: FC = () => {
  const data: { label: string; to: To }[] = [
    {
      label: 'Главная',
      to: '/',
    },
    ...remoteDefinitions.map((definition) => ({
      label: definition.name,
      to: definition.name.toLowerCase(),
    })),
  ];

  const links = data.map((item) => (
    <NavLink
      // eslint-disable-next-line react/no-array-index-key
      key={item.label}
      className={({ isActive }) => [styles.link, isActive && styles.active].join(' ')}
      to={item.to}
    >
      {item.label}
    </NavLink>
  ));

  return (
    <AppShell.Navbar className={styles.navbar}>
      <div className={styles.navbarMain}>
        <Group className={styles.header} justify="space-between">
          <Title order={3}>SIMuRG Services</Title>
          <Code fw={700}>v0.0.1</Code>
        </Group>
        {links}
      </div>
    </AppShell.Navbar>
  );
};
