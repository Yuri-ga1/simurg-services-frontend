import { Center, Loader, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Suspense, type FC } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '../pages';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

export const App: FC = () => (
  <MantineProvider withCssVariables>
    <Notifications />
    <Suspense
      fallback={
        <Center maw="100%" mih="100vh">
          <Loader />
        </Center>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  </MantineProvider>
);
