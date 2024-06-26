import { Code, Grid, Title, Box } from '@mantine/core';
import { useState, type FC } from 'react';
import type { BuildGraphResponseFake } from '~/api';
import { useTranslation } from '~/lib/i18next';
import { Form } from '~/ui/form/form';
import type { GraphDataItem } from '~/ui/graph/config';
import GraphSignalTypesData from '~/ui/graph/graphs';

// import { graphData } from '~/ui/graph/config';

const App: FC = () => {
  const [result, setResult] = useState<Nullable<BuildGraphResponseFake>>(null);
  const [graphData, setGraphData] = useState<GraphDataItem[]>([]);
  const { t } = useTranslation();

  return (
    <Grid gutter="lg">
      <Grid.Col span={4}>
        <Form onSubmit={setResult} setGraphData={setGraphData} />
      </Grid.Col>
      <Grid.Col span={8}>
        <Box style={{ height: '100%' }}>
          <GraphSignalTypesData graphData={graphData} />
        </Box>
      </Grid.Col>
      {result && (
        <div>
          <Title order={3}>{t('content.jsonResult')}</Title>
          <Code mt="xs" block style={{ display: 'inline-block' }}>
            {JSON.stringify(result, null, 2)}
          </Code>
        </div>
      )}
    </Grid>
  );
};

export default App;
