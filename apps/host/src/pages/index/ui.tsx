import { Divider, Text, Title } from '@mantine/core';
import { type FC } from 'react';
import { useTranslation } from '~/shared/lib/i18next';
import { Page } from '~/shared/ui';

export const IndexPage: FC = () => {
  const { t } = useTranslation();

  return (
    <Page title={t('home.title')}>
      <Title>{t('home.title')}</Title>
      <Divider my="md" />
      <Text>{t('common.empty')} 😔</Text>
    </Page>
  );
};
