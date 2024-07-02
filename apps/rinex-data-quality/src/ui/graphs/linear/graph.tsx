import { ResponsiveLine } from '@nivo/line';
import PropTypes from 'prop-types';
import type { LinearGraphData } from './config';

type LinearGraphProps = {
  data: LinearGraphData[];
  // elevationData: LinearGraphData[];
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
  lineColor?: string;
  redZoneColor?: string;
  elevationDataColor?: string;
};

type RenderRedZonesProps = {
  series: { data: { isRedZone: boolean; position: { x: number } }[] }[];
  innerWidth: number;
  innerHeight: number;
};

const renderRedZones = ({ series, innerWidth, innerHeight }: RenderRedZonesProps): JSX.Element => {
  const redZones: { x0: number; x1: number }[] = [];
  series.forEach(({ data }) => {
    let isInRedZone = false;
    let redZoneStartX: number | null = null;

    data.forEach((point) => {
      if (point.data.isRedZone && !isInRedZone) {
        isInRedZone = true;
        redZoneStartX = point.position.x;
      } else if (!point.data.isRedZone && isInRedZone) {
        isInRedZone = false;
        redZones.push({
          x0: redZoneStartX!,
          x1: point.position.x,
        });
      }
    });

    if (isInRedZone) {
      redZones.push({
        x0: redZoneStartX,
        x1: innerWidth,
      });
    }
  });

  return (
    <>
      {redZones.map((zone) => (
        <rect
          key={`${zone.x0}-${zone.x1}`}
          x={zone.x0}
          y={0}
          width={zone.x1 - zone.x0}
          height={innerHeight}
          fill="rgba(255, 0, 0, 0.3)"
        />
      ))}
    </>
  );
};

const LinearGraph: React.FC<LinearGraphProps> = ({
  data,
  // elevationData,
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
  lineColor = 'hsl(118, 100%, 50%)',
  redZoneColor = 'rgba(255, 0, 0, 0.3)',
  // elevationDataColor = 'hsl(38, 100%, 50%)',
}) => {
  const processedData = data.map((series) => ({
    ...series,
    data: series.data.map((point) => ({
      ...point,
      y: point.y === 0 ? null : point.y,
      isRedZone: point.y === 0,
    })),
  }));

  return (
    <div style={{ height, width }}>
      <ResponsiveLine
        data={processedData}
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
        colors={lineColor}
        legends={[
          {
            anchor: 'top',
            direction: 'row',
            itemDirection: 'left-to-right',
            translateY: -30,
            itemWidth: 80,
            itemHeight: 20,
            symbolSize: 12,
            symbolShape: 'circle',
            data: [
              ...data.map((series) => ({
                id: series.id,
                label: series.id,
                color: lineColor,
              })),
              { id: 'redZone', label: 'Dead Zone 💀💀💀', color: redZoneColor },
            ],
          },
        ]}
        layers={[
          'grid',
          'markers',
          'areas',
          'lines',
          'slices',
          'points',
          'axes',
          'legends',
          renderRedZones,
        ]}
      />
    </div>
  );
};

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
  // elevationData: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     id: PropTypes.string.isRequired,
  //     color: PropTypes.string,
  //     data: PropTypes.arrayOf(
  //       PropTypes.shape({
  //         x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  //         y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  //       }),
  //     ).isRequired,
  //   }),
  // ).isRequired,
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
  lineColor: PropTypes.string.isRequired,
  redZoneColor: PropTypes.string.isRequired,
};

export default LinearGraph;
