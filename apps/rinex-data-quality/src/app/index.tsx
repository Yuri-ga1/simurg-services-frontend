import { Code, Grid, Title, Box } from '@mantine/core';
import { notification } from '@repo/lib/notification';
import { useState, type FC } from 'react';
import { useTranslation } from '~/lib/i18next';
import { Form } from '~/ui/form/form';
import { getStatus, type GraphDataItem } from '~/ui/graph/config';
import GraphSignalTypesData from '~/ui/graph/graphs';

const App: FC = () => {
  const [holesData, setHolesData] = useState<GraphDataItem[]>([]);
  const [mainGraphData, setMainGraphData] = useState<GraphDataItem[]>([]);
  const [satSigData, setSatSigData] = useState<GraphDataItem[]>([]);
  const [sigTimeData, setSigTimeData] = useState<GraphDataItem[]>([]);
  const [dataPeriod, setDataPeriod] = useState<number>(0);
  const { t } = useTranslation();

  const buildSatelliteSignalGraph = (id: string): void => {
    const filteredData = holesData.filter((item) => item.id.startsWith(id));

    if (filteredData.length === 0) {
      notification.error({
        title: t('common.error'),
        message: t('graph.alertNoData'),
      });
    } else {
      filteredData.sort((a, b) => {
        const idA = a.id.toUpperCase();
        const idB = b.id.toUpperCase();

        if (idA < idB) {
          return -1;
        }
        if (idA > idB) {
          return 1;
        }
        return 0;
      });

      const transformedData = filteredData.map((item) => ({
        ...item,
        data: item.data.map((d) => ({
          ...d,
          y: Array.isArray(d.y) && d.y.every((val) => val === -1) ? 'No signal' : 'Complete',
        })),
      }));
      setSatSigData(transformedData);
    }
  };

  const buildSignalTimeGraph = (id: string): void => {
    const filteredData = holesData.filter((item) => item.id === id);

    if (filteredData.length === 0) {
      notification.error({
        title: t('common.error'),
        message: t('graph.alertNoData'),
      });
    } else {
      const transformedData = filteredData.flatMap((item) =>
        item.data.map((d) => {
          const allNoData = d.y.every((val) => val === -1);
          return {
            id: d.x,
            data: d.y.map((val, index) => {
              const timestampInMinutes = index * dataPeriod;
              const hours = Math.floor(timestampInMinutes / 60)
                .toString()
                .padStart(2, '0');
              const minutes = (timestampInMinutes % 60).toString().padStart(2, '0');
              const timeString = `${hours}:${minutes}`;
              return {
                x: timeString, // Время в формате HH:mm
                y: allNoData ? 'No signal' : getStatus(val),
                NO_DATA: allNoData ? 'No Data' : undefined,
              };
            }),
          };
        }),
      );

      setSigTimeData(transformedData);
    }
  };

  return (
    <Grid gutter="lg">
      <Grid.Col span={4}>
        <Form
          onSubmit={setHolesData}
          setMainGraphData={setMainGraphData}
          setDataPeriod={setDataPeriod}
        />
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
            topLegendOffset={-60}
            leftLegendOffset={-45}
            onYAxisClick={buildSignalTimeGraph}
            graphData={satSigData}
          />
        </Box>
      </Grid.Col>
      <Grid.Col span={8}>
        <Box style={{ height: '100%' }}>
          <GraphSignalTypesData
            height="700px"
            margin_top={60}
            topTickRotation={-90}
            margin_bottom={30}
            margin_right={30}
            margin_left={40}
            topLegendOffset={-60}
            leftLegendOffset={-45}
            graphData={sigTimeData}
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
