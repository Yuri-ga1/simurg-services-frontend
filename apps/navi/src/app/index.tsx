import { Code, Stack, Title } from '@mantine/core';
import { useState, type FC } from 'react';
import { type CoordinateCalculationResponse } from '~/api';
import { useTranslation } from '~/lib/i18next';
import { Form } from '~/ui';

const App: FC = () => {
  const [result, setResult] = useState<Nullable<CoordinateCalculationResponse>>(null);
  const { t } = useTranslation();

  return (
    <Stack>
      <Form onSubmit={setResult} />
      {result && (
        <div>
          <Title order={3}>{t('content.jsonResult')}</Title>
          <Code mt="xs" block style={{ display: 'inline-block' }}>
            {`{
    "valid": ${result.valid},
    "coordinates": [${result.coordinates}]
}`}
          </Code>
        </div>
      )}
    </Stack>
  );
};

export default App;
