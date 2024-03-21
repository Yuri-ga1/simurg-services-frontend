import { Code, Stack, Title } from '@mantine/core';
import { useState, type FC } from 'react';
import { type CoordinateCalculationResponse } from '~/api';
import { useTranslation } from '~/lib/i18next';
import { Form } from './form';

export const Content: FC = () => {
  const [result, setResult] = useState<Nullable<CoordinateCalculationResponse>>(null);

  return (
    <Stack>
      <Form onSubmit={setResult} />
      {result && <ResultView result={result} />}
    </Stack>
  );
};

type ResultViewProps = {
  result: CoordinateCalculationResponse;
};

const ResultView: FC<ResultViewProps> = ({ result }) => {
  const { t } = useTranslation();

  const jsonCode = `{
    "valid": ${result.valid},
    "coordinates": [${result.coordinates}]
}`;

  return (
    <div>
      <Title order={3}>{t('content.jsonResult')}</Title>
      <Code mt="xs" block style={{ display: 'inline-block' }}>
        {jsonCode}
      </Code>
    </div>
  );
};
