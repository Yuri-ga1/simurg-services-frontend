import { Code, Grid, Title, Box } from '@mantine/core';
import { notification } from '@repo/lib/notification';
import { useState, type FC } from 'react';
import { api } from '~/api';
import { useTranslation } from '~/lib/i18next';
import { Form } from '~/ui/form/form';
import { DataStatus, getStatus, type GraphDataItem } from '~/ui/graphs/heatmap/config';
import GraphSignalTypesData from '~/ui/graphs/heatmap/graph';
import {
  formatSignalDataForNivo,
  type SignalData,
  type LinearGraphData,
} from '~/ui/graphs/linear/config';
import LinearGraph from '~/ui/graphs/linear/graph';

const App: FC = () => {
  const [holesData, setHolesData] = useState<GraphDataItem[]>([]);
  const [mainGraphData, setMainGraphData] = useState<GraphDataItem[]>([]);
  const [satSigData, setSatSigData] = useState<GraphDataItem[]>([]);
  const [sigTimeData, setSigTimeData] = useState<GraphDataItem[]>([]);
  const [satelliteData, setSatelliteData] = useState<SignalData>();
  const [linearData, setLinearData] = useState<LinearGraphData[]>([]);

  const [dataPeriod, setDataPeriod] = useState<number>(0);
  const [topAxisLabel, setTopAxisLabel] = useState<string>('');
  const [leftAxisLabel, setLeftAxisLabel] = useState<string>('');

  const { t } = useTranslation();

  const fetchSatelliteData = async (id: string): Promise<void> => {
    const formData = new FormData();
    formData.append('satellite', id);

    try {
      const data = await api.getSatelliteData(formData);
      setSatelliteData(data);
    } catch {
      notification.error({
        title: t('common.error'),
        message: t('form.buildGraphError'),
      });
    }
  };

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
          y:
            Array.isArray(d.y) && d.y.every((val) => val === -1)
              ? DataStatus.NO_SIGNAL
              : DataStatus.COMPLETE,
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
                x: timeString,
                y: allNoData ? DataStatus.NO_SIGNAL : getStatus(val),
              };
            }),
          };
        }),
      );

      fetchSatelliteData(id);

      setTopAxisLabel('Time');
      setLeftAxisLabel('Signals');
      setSigTimeData(transformedData);
    }
  };

  const handleCellClick = (cell: any): void => {
    const signal = cell.serieId;
    const time = cell.data.x;

    if (
      [DataStatus.COMPLETE, DataStatus.MINOR_HOLES, DataStatus.MAJOR_HOLES].includes(cell.value)
    ) {
      setLinearData(formatSignalDataForNivo(signal, satelliteData, dataPeriod, time));
    } else {
      notification.error({
        title: t('common.error'),
        message: t('graph.alertNoData'),
      });
    }
  };

  return (
    <Grid gutter="lg" style={{ margin: '5px' }}>
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
            height="250px"
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
            topLegendOffset={-45}
            leftLegendOffset={-45}
            topTickRotation={-90}
            onYAxisClick={buildSignalTimeGraph}
            graphData={satSigData}
          />
        </Box>
      </Grid.Col>
      <Grid.Col span={8}>
        <Box style={{ height: '100%' }}>
          <GraphSignalTypesData
            topAxisname={topAxisLabel}
            leftAxisname={leftAxisLabel}
            height="300px"
            margin_top={60}
            topTickRotation={-90}
            margin_bottom={30}
            margin_right={30}
            margin_left={50}
            topLegendOffset={-60}
            leftLegendOffset={-45}
            graphData={sigTimeData}
            cellOnClickEvent={handleCellClick}
          />
          <LinearGraph
            data={linearData}
            margin_left={100}
            margin_bottom={70}
            bottomLegendOffset={65}
            bottomTickRotation={-90}
            leftLegendOffset={-70}
          />
        </Box>
      </Grid.Col>
      {linearData && (
        <div>
          <Title order={3}>{t('content.jsonResult')}</Title>
          <Code mt="xs" block style={{ display: 'inline-block' }}>
            {JSON.stringify(linearData, null, 2)}
          </Code>
        </div>
      )}
    </Grid>
  );
};

export default App;
