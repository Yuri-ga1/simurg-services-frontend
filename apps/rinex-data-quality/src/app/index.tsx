import { Code, Grid, Title, Box } from '@mantine/core';
import { notification } from '@repo/lib/notification';
import { useState, type FC } from 'react';
import { api } from '~/api';
import { useTranslation } from '~/lib/i18next';
import { Form } from '~/ui/form/form';
import {
  testMainGraphData,
  testSatSigData,
  testSigTimeData,
  DataStatus,
  getStatus,
  type GraphDataItem,
} from '~/ui/graphs/heatmap/config';
import GraphSignalTypesData from '~/ui/graphs/heatmap/graph';
import {
  testLinearData,
  testElevationData,
  formatSignalDataForNivo,
  type SignalData,
  type LinearGraphData,
} from '~/ui/graphs/linear/config';
import LinearGraph from '~/ui/graphs/linear/graph';

const flipData = (data: GraphDataItem[]): GraphDataItem[] => {
  const flippedData: { [key: string]: { x: string; y: DataStatus }[] } = {};

  data.forEach((item) => {
    item.data.forEach((d) => {
      if (!flippedData[d.x]) {
        flippedData[d.x] = [];
      }
      flippedData[d.x].push({ x: item.id, y: d.y });
    });
  });

  return Object.entries(flippedData).map(([key, value]) => ({
    id: key,
    data: value,
  }));
};

const App: FC = () => {
  const { t } = useTranslation();

  const [holesData, setHolesData] = useState<GraphDataItem[]>([]);
  const [mainGraphData, setMainGraphData] = useState<GraphDataItem[]>(testMainGraphData);
  const [satSigData, setSatSigData] = useState<GraphDataItem[]>(testSatSigData);
  const [sigTimeData, setSigTimeData] = useState<GraphDataItem[]>(testSigTimeData);
  const [satelliteData, setSatelliteData] = useState<SignalData>();
  const [linearData, setLinearData] = useState<LinearGraphData[]>(testLinearData);
  const [elevationData, setElevationData] = useState<LinearGraphData[]>(testElevationData);

  const [dataPeriod, setDataPeriod] = useState<number>(0);
  const [topAxisLabel, setTopAxisLabel] = useState<string>(t('graph.axisSignal'));
  const [leftAxisLabel, setLeftAxisLabel] = useState<string>(t('graph.axisTime'));

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

      setTopAxisLabel(t('graph.axisSignal'));
      setLeftAxisLabel(t('graph.axisTime'));
      setSigTimeData(flipData(transformedData));
    }
  };

  const handleCellClick = (cell: any): void => {
    // const signal = cell.serieId;
    // const time = cell.data.x;

    const time = cell.serieId;
    const signal = cell.data.x;

    if (
      [DataStatus.COMPLETE, DataStatus.MINOR_HOLES, DataStatus.MAJOR_HOLES].includes(cell.value)
    ) {
      const [formattedSignalData, formattedElevationData] = formatSignalDataForNivo(
        signal,
        satelliteData,
        dataPeriod,
        time,
      );
      setLinearData([formattedSignalData]);
      setElevationData([formattedElevationData]);
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
            topAxisname={t('graph.axisSignal')}
            leftAxisname={t('graph.axisSatellite')}
            margin_top={30}
            margin_left={35}
            topLegendOffset={-35}
            leftLegendOffset={-30}
            graphData={mainGraphData}
            onYAxisClick={buildSatelliteSignalGraph}
          />
        </Box>
      </Grid.Col>
      <Grid.Col span={3}>
        <Box style={{ height: '100%' }}>
          <GraphSignalTypesData
            height="700px"
            topAxisname={t('graph.axisSignal')}
            leftAxisname={t('graph.axisSatellite')}
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
      <Grid.Col span={2}>
        <Box style={{ height: '100%', position: 'relative' }}>
          <GraphSignalTypesData
            topAxisname={topAxisLabel}
            leftAxisname={leftAxisLabel}
            height="700px"
            topTickRotation={-90}
            margin_top={50}
            margin_bottom={30}
            margin_right={30}
            margin_left={50}
            topLegendOffset={-40}
            leftLegendOffset={-45}
            graphData={sigTimeData}
            cellOnClickEvent={handleCellClick}
          />
        </Box>
      </Grid.Col>
      <Grid.Col span={7}>
        <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box style={{ flexGrow: 1 }}>
            <LinearGraph
              data={linearData}
              margin_left={78}
              margin_bottom={70}
              leftLegendOffset={-73}
              bottomLegendOffset={65}
              bottomTickRotation={-90}
            />
          </Box>
          <Box style={{ flexGrow: 1, display: 'flex', alignItems: 'flex-end' }}>
            <LinearGraph
              data={elevationData}
              lineColor="hsl(38, 100%, 50%)"
              margin_left={50} // 100
              margin_bottom={70}
              bottomLegendOffset={65}
              bottomTickRotation={-90}
              leftLegendOffset={-45}
            />
          </Box>
        </Box>
      </Grid.Col>
      {sigTimeData && (
        <div>
          <Title order={3}>{t('content.jsonResult')}</Title>
          <Code mt="xs" block style={{ display: 'inline-block' }}>
            {JSON.stringify(sigTimeData, null, 2)}
          </Code>
        </div>
      )}
    </Grid>
  );
};

export default App;
