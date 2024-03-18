import { type FC } from 'react';
import { CustomDateInput } from '@repo/ui';
import { Box } from '@mantine/core';

export const Form: FC = () => (
  <Box maw={400}>
    <form>
      <CustomDateInput
        withAsterisk
        label="Дата начала"
        placeholder="дд.мм.гггг"
        tooltip="Сперва нужно выбрать ионосферный центр"
        tooltipPosition="bottom-start"
        defaultLevel="decade"
      />
    </form>
  </Box>
);
