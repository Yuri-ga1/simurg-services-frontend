import { Stack, Title } from '@mantine/core';
import { useState, type FC, useMemo } from 'react';
import { Form } from '../form';
import { type GetResultResponse } from '../../api';
import { Chart } from '../chart';

export const Content: FC = () => {
  const [result, setResult] = useState<Nullable<GetResultResponse>>(null);

  const timestamps = useMemo(() => result?.timestamps.map((value) => value * 1000) ?? [], [result]);

  return (
    <Stack>
      <Form onResultGet={setResult} />
      {result && (
        <div>
          <Title order={3}>График результата</Title>
          <Chart rec={result.rec} tec={result.average_mean_tec} timestamps={timestamps} />
        </div>
      )}
    </Stack>
  );
};
