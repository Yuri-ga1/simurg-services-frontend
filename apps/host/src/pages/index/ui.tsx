import { type FC } from 'react';
import { Divider, Text, Title } from '@mantine/core';
import { Page } from '../../shared/ui';
import { useTranslation } from '../../shared/lib/i18next';

export const IndexPage: FC = () => {
  const { t } = useTranslation();

  return (
    <Page title={t('home.title')}>
      <Title>{t('home.title')}</Title>
      <Divider my="md" />
      <Text>{t('common.empty')} &#9785;&#65039;</Text>
    </Page>
  );
};
