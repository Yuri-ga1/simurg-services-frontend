import { Center, Loader } from '@mantine/core';
import { CustomThemeProvider } from '@repo/ui';
import { Suspense, type FC } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ServiceProvider } from '~/entities/service';
import { router } from '~/pages';

export const App: FC = () => (
  <CustomThemeProvider>
    <Suspense
      fallback={
        <Center maw="100%" mih="100vh">
          <Loader />
        </Center>
      }
    >
      <ServiceProvider>
        <RouterProvider router={router} />
      </ServiceProvider>
    </Suspense>
  </CustomThemeProvider>
);
