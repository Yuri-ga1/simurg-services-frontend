import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import type { LinearGraphData } from './config';

type LinearGraphProps = {
  data: LinearGraphData[];
  height?: string;
  width?: string;
  margin_top?: number;
  margin_bottom?: number;
  margin_left?: number;
  margin_right?: number;
  bottomLegendOffset?: number;
  leftLegendOffset?: number;
  bottomTickRotation?: number;
  botomAxisLegend?: string;
  leftAxisLegend?: string;
};

const LinearGraph: React.FC<LinearGraphProps> = ({
  data,
  height = '300px',
  width = '100%',
  margin_top = 30,
  margin_bottom = 30,
  margin_left = 30,
  margin_right = 30,
  bottomLegendOffset = 50,
  leftLegendOffset = -40,
  bottomTickRotation = 0,
  botomAxisLegend = 'Time',
  leftAxisLegend = 'Value',
}) => (
  <div style={{ height, width }}>
    <ResponsiveLine
      data={data}
      margin={{ top: margin_top, right: margin_right, bottom: margin_bottom, left: margin_left }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: bottomTickRotation,
        legend: botomAxisLegend,
        legendOffset: bottomLegendOffset,
        legendPosition: 'middle',
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: leftAxisLegend,
        legendOffset: leftLegendOffset,
        legendPosition: 'middle',
        truncateTickAt: 0,
      }}
      pointSize={5}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabel="data.yFormatted"
      pointLabelYOffset={-12}
      enableTouchCrosshair
      useMesh
      legends={[
        {
          anchor: 'top',
          direction: 'column',
          translateY: -30,
          itemWidth: 80,
          itemHeight: 20,
          symbolSize: 12,
          symbolShape: 'circle',
        },
      ]}
    />
  </div>
);

LinearGraph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      color: PropTypes.string,
      data: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
          y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  height: PropTypes.string,
  width: PropTypes.string,
  margin_top: PropTypes.number,
  margin_bottom: PropTypes.number,
  margin_left: PropTypes.number,
  margin_right: PropTypes.number,
  bottomLegendOffset: PropTypes.number,
  leftLegendOffset: PropTypes.number,
  bottomTickRotation: PropTypes.number,
  botomAxisLegend: PropTypes.string,
  leftAxisLegend: PropTypes.string,
};

export default LinearGraph;
