import { CustomThemeProvider } from '@repo/ui';
import { type FC } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '~/pages';

const App: FC = () => (
  <CustomThemeProvider>
    <RouterProvider router={router} />
  </CustomThemeProvider>
);

export default App;
