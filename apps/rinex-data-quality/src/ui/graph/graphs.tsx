/* eslint-disable react/prop-types */
import { ResponsiveHeatMap } from '@nivo/heatmap';
import type { GraphDataItem } from './config';

type GraphSignalTypesDataProps = {
  graphData: GraphDataItem[];
};

const GraphSignalTypesData: React.FC<GraphSignalTypesDataProps> = ({ graphData }) => (
  <div style={{ height: '300px' }}>
    <ResponsiveHeatMap
      data={graphData}
      margin={{ right: 30, bottom: 60, left: 30 }}
      colors={({ value }) => (value === 1 ? 'green' : '#555555')}
      borderWidth={2}
      borderColor="gray"
      emptyColor="#FFFFFF"
      labelTextColor="transparent"
      inactiveOpacity={0.5}
      forceSquare
      axisTop={{
        tickSize: 5,
        tickPadding: 5,
        legend: '',
        legendOffset: 46,
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Signals',
        legendPosition: 'middle',
        legendOffset: -40,
        truncateTickAt: 0,
      }}
    />
  </div>
);

export default GraphSignalTypesData;
