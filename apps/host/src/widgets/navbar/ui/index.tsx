import { AppShell, Code, Group, Title, Tooltip, Text, Space } from '@mantine/core';
import { isUndefined } from '@repo/lib/typescript';
import { type PropsWithChildren, type FC } from 'react';
import { NavLink, type To } from 'react-router-dom';
import { useServiceStore } from '~/entities/service';
import { PickLanguageSelect } from '~/features/pick-language';
import { REMOTE_DEFINITIONS } from '~/shared/config/module-federation';
import { ROUTES } from '~/shared/config/routes';
import { useTranslation } from '~/shared/lib/i18next';
import { SkeletonList } from '~/shared/ui';
import styles from './styles.module.css';

export const Navbar: FC = () => {
  const { services, isLoaded } = useServiceStore();
  const { t } = useTranslation();

  const data: { label: string; to: To; isActive?: boolean }[] = REMOTE_DEFINITIONS.map(
    (definition) => ({
      label: definition.name,
      to: definition.routePath,
      isActive: services.some(
        (service) => service.name === definition.serviceName && service['status-code'] === 200,
      ),
    }),
  );

  const links = data.map((item) =>
    !isUndefined(item.isActive) && !item.isActive ? (
      <Tooltip key={item.label} label={t('service.notAvailable')}>
        <Text className={styles.link} style={{ cursor: 'not-allowed' }}>
          {item.label}
        </Text>
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
        <NavbarLink to={ROUTES.home}>{t('home.title')}</NavbarLink>
        {isLoaded ? (
          links
        ) : (
          <>
            <Space h="sm" />
            <SkeletonList count={5} gap="sm" itemProps={{ h: 32 }} />
          </>
        )}
      </div>
      <PickLanguageSelect />
    </AppShell.Navbar>
  );
};

type NavbarLinkProps = PropsWithChildren<{ to: To }>;

const NavbarLink: FC<NavbarLinkProps> = ({ to, children }) => (
  <NavLink className={({ isActive }) => [styles.link, isActive && styles.active].join(' ')} to={to}>
    {children}
  </NavLink>
);
