import { Divider, Text, Title } from '@mantine/core';
import { type FC } from 'react';
import { useTranslation } from '~/shared/lib/i18next';
import { PageShell } from '~/shared/ui/page-shell';

export const IndexPage: FC = () => {
  const { t } = useTranslation();

  return (
    <PageShell documentTitle={t('home.title')}>
      <Title>{t('home.title')}</Title>
      <Divider my="md" />
      <Text>{t('common.empty')} 😔</Text>
    </PageShell>
  );
};
