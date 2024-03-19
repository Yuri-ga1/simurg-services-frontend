import { createRoot } from 'react-dom/client';
import { CustomThemeProvider } from '@repo/ui';
import { Content } from './ui/content';

createRoot(document.getElementById('root')!).render(
  <CustomThemeProvider>
    <Content />
  </CustomThemeProvider>,
);
