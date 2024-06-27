import { Code, Grid, Title, Box } from '@mantine/core';
import { useState, type FC } from 'react';
import { useTranslation } from '~/lib/i18next';
import { Form } from '~/ui/form/form';
import type { GraphDataItem } from '~/ui/graph/config';
import GraphSignalTypesData from '~/ui/graph/graphs';

const App: FC = () => {
  const [result, setResult] = useState<GraphDataItem[]>([]);
  const [graphData, setGraphData] = useState<GraphDataItem[]>([]);
  const { t } = useTranslation();

  return (
    <Grid gutter="lg">
      <Grid.Col span={4}>
        <Form onSubmit={setResult} setGraphData={setGraphData} />
      </Grid.Col>
      <Grid.Col span={8}>
        <Box style={{ height: '100%' }}>
          <GraphSignalTypesData
            height="300px"
            margin_top={0}
            topLegendOffset={-35}
            leftLegendOffset={-40}
            graphData={graphData}
          />
        </Box>
      </Grid.Col>
      <Grid.Col span={12}>
        <Box style={{ height: '100%' }}>
          <GraphSignalTypesData
            topTickRotation={-90}
            // transform ='rotate(-90deg)'
            height="550px"
            margin_top={70}
            margin_bottom={30}
            margin_right={30}
            margin_left={30}
            topLegendOffset={-50}
            leftLegendOffset={-40}
            graphData={result}
          />
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
