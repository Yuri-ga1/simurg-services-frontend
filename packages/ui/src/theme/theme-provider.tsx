import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { type FC, type PropsWithChildren } from 'react';
import { customTheme } from './theme-override';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

export const CustomThemeProvider: FC<PropsWithChildren> = ({ children }) => (
  <MantineProvider theme={customTheme} withCssVariables>
    <Notifications />
    {children}
  </MantineProvider>
);
