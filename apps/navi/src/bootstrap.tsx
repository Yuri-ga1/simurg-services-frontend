import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { createRoot } from 'react-dom/client';
import { Form } from './ui/form';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

createRoot(document.getElementById('root')!).render(
  <MantineProvider withCssVariables>
    <Notifications />
    <Form />
  </MantineProvider>,
);
