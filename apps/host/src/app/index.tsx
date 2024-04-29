import { CustomThemeProvider } from '@repo/ui';
import { useEffect, type FC } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useServiceFetch } from '~/entities/service';
import { router } from '~/pages';

const AppLoad: FC = () => {
  const fetchServices = useServiceFetch();

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export const App: FC = () => (
  <CustomThemeProvider>
    <AppLoad />
    <RouterProvider router={router} />
  </CustomThemeProvider>
);
