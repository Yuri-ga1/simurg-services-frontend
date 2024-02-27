import { type FC } from 'react';
import { Page } from '~/shared/ui';
import { Divider, Text, Title } from '@mantine/core';
import { APP_NAME } from '~/shared/config/env';

export const IndexPage: FC = () => (
  <Page title={`${APP_NAME} | Главная`}>
    <Title>Главная</Title>
    <Divider my="md" />
    <Text>Пусто &#9785;&#65039;</Text>
  </Page>
);
