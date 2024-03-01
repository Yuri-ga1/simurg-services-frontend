import { type FC } from 'react';
import { Divider, Text, Title } from '@mantine/core';
import { Page } from '../../shared/ui';

export const IndexPage: FC = () => (
  <Page title="Home">
    <Title>Home</Title>
    <Divider my="md" />
    <Text>Empty &#9785;&#65039;</Text>
  </Page>
);
