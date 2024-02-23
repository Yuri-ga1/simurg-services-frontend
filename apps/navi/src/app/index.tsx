import { type FC } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Form } from '../ui/form';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

export const App: FC = () => (
  <MantineProvider withCssVariables>
    <Notifications />
    <Form />
  </MantineProvider>
);
