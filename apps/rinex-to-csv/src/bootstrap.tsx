import { CustomThemeProvider } from '@repo/ui';
import { createRoot } from 'react-dom/client';
import { Form } from './ui/form';

createRoot(document.getElementById('root')!).render(
  <CustomThemeProvider>
    <Form />
  </CustomThemeProvider>,
);
