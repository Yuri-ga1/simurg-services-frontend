import { type MantineThemeOverride } from '@mantine/core';

export const customTheme: MantineThemeOverride = {
  components: {
    DateInput: {
      defaultProps: {
        valueFormat: 'DD.MM.YYYY',
      },
    },
  },
};
