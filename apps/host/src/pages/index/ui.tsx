import { type FC } from 'react';
import { Divider, Text, Title } from '@mantine/core';
import { Page } from '../../shared/ui';

export const IndexPage: FC = () => (
  <Page title="Главная">
    <Title>Главная</Title>
    <Divider my="md" />
    <Text>Пусто &#9785;&#65039;</Text>
  </Page>
);
