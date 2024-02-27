import { Center, Loader, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Suspense, type FC, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Pages } from '~/pages';
import { BackendServiceProvider, useBackendServiceHandlers } from '~/entities/backend-service';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

const App: FC = () => {
  const { loadBackendServices } = useBackendServiceHandlers();

  useEffect(() => {
    loadBackendServices();
  }, [loadBackendServices]);

  return <Pages />;
};

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
        <BackendServiceProvider>
          <App />
        </BackendServiceProvider>
      </Suspense>
    </MantineProvider>
  </BrowserRouter>
);
