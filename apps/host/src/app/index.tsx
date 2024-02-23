import { Center, Loader, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Suspense, type FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Pages } from '~/pages';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const App: FC = () => <Pages />;

export const AppWithProviders: FC = () => (
  <BrowserRouter>
    <MantineProvider withCssVariables>
      <Notifications />
      <Suspense
        fallback={
          <Center maw="100%" mih="100vh">
            <Loader />
          </Center>
        }
      >
        <App />
      </Suspense>
    </MantineProvider>
  </BrowserRouter>
);
