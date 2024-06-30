import { Code, Grid, Title, Box } from '@mantine/core';
import { notification } from '@repo/lib/notification';
import { useState, type FC } from 'react';
import { useTranslation } from '~/lib/i18next';
import { Form } from '~/ui/form/form';
import type { GraphDataItem } from '~/ui/graph/config';
import GraphSignalTypesData from '~/ui/graph/graphs';

const App: FC = () => {
  const [holesData, setHolesData] = useState<GraphDataItem[]>([]);
  const [mainGraphData, setMainGraphData] = useState<GraphDataItem[]>([]);
  const [satSigData, setSatSigData] = useState<GraphDataItem[]>([]);
  // const [satSigData, setSatSigData] = useState<GraphDataItem[]>([]);
  const { t } = useTranslation();

  const buildSatelliteSignalGraph = (id: string): void => {
    const filteredData = holesData.filter((item) => item.id.startsWith(id));

    if (filteredData.length === 0) {
      notification.error({
        title: t('common.error'),
        message: t('graph.alertNoData'),
      });
    } else {
      const transformedData = filteredData.map((item) => ({
        ...item,
        data: item.data.map((d) => ({
          ...d,
          y: Array.isArray(d.y) && d.y.every(val => val === -1) ? 'No signal' : 'Complete',
        })),
      }));
      setSatSigData(transformedData);
    }
  };

  return (
    <Grid gutter="lg">
      <Grid.Col span={4}>
        <Form onSubmit={setHolesData} setMainGraphData={setMainGraphData} />
      </Grid.Col>
      <Grid.Col span={8}>
        <Box style={{ height: '100%' }}>
          <GraphSignalTypesData
            height="300px"
            margin_top={0}
            margin_left={35}
            topLegendOffset={-35}
            leftLegendOffset={-30}
            graphData={mainGraphData}
            onYAxisClick={buildSatelliteSignalGraph}
          />
        </Box>
      </Grid.Col>
      <Grid.Col span={4}>
        <Box style={{ height: '100%' }}>
          <GraphSignalTypesData
            height="700px"
            margin_top={60}
            margin_bottom={30}
            margin_right={30}
            margin_left={30}
            topLegendOffset={-30}
            leftLegendOffset={-45}
            graphData={satSigData}
          />
        </Box>
      </Grid.Col>
      <Grid.Col span={8}>
        <Box style={{ height: '100%' }}>
          <GraphSignalTypesData
            height="700px"
            margin_top={60}
            margin_bottom={30}
            margin_right={30}
            margin_left={30}
            topLegendOffset={-30}
            leftLegendOffset={-45}
            graphData={satSigData}
          />
        </Box>
      </Grid.Col>
      {holesData && (
        <div>
          <Title order={3}>{t('content.jsonResult')}</Title>
          <Code mt="xs" block style={{ display: 'inline-block' }}>
            {JSON.stringify(holesData, null, 2)}
          </Code>
        </div>
      )}
    </Grid>
  );
};

export default App;
