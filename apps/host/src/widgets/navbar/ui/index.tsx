import { AppShell, Code, Group, Title, Tooltip, Text } from '@mantine/core';
import { type PropsWithChildren, type FC } from 'react';
import { NavLink, type To } from 'react-router-dom';
import { isUndefined } from '@repo/lib/typescript';
import { useServiceState } from '../../../entities/service';
import styles from './styles.module.css';
import remoteDefinitions from '/module-federation.manifest.json';
import { SkeletonList } from '../../../shared/ui';
import { PickLanguageSelect } from '../../../features/pick-language';
import { useTranslation } from '../../../shared/lib/i18next';

type NavbarLinkProps = PropsWithChildren<{ to: To }>;

const NavbarLink: FC<NavbarLinkProps> = ({ to, children }) => (
  <NavLink className={({ isActive }) => [styles.link, isActive && styles.active].join(' ')} to={to}>
    {children}
  </NavLink>
);

export const Navbar: FC = () => {
  const { services, isLoaded } = useServiceState();
  const { t } = useTranslation();

  const data: { label: string; to: To; isActive?: boolean }[] = [
    {
      label: t('home.title'),
      to: '/',
    },
    ...remoteDefinitions.map((definition) => ({
      label: definition.name,
      to: definition.routePath,
      isActive: services.some(
        (service) => service.name === definition.backendName && service['status-code'] === 200,
      ),
    })),
  ];

  const links = data.map((item) =>
    !isUndefined(item.isActive) && !item.isActive ? (
      <Tooltip key={item.label} label={t('service.notAvailable')}>
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
        {isLoaded ? links : <SkeletonList count={5} itemProps={{ h: 32, mt: 'sm' }} />}
      </div>
      <PickLanguageSelect />
    </AppShell.Navbar>
  );
};
