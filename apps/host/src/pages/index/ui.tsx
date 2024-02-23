import { type FC } from 'react';
import { Page } from '~/shared/ui';
import { Title } from '@mantine/core';
import { APP_NAME } from '~/shared/config/env';

export const IndexPage: FC = () => (
  <Page title={`${APP_NAME} | Главная`}>
    <Title>Главная</Title>
  </Page>
);
