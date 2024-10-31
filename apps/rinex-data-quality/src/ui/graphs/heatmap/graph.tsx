import { useTheme } from '@nivo/core';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import React, { useState, useEffect } from 'react';
import { useTranslation } from '~/lib/i18next';
import {
  testMainGraphData,
  testSatSigData,
  testSigTimeData,
  completeData,
  DataStatus,
  type GraphDataItem,
} from './config';

type GraphSignalTypesDataProps = {
  topAxisname?: string;
  leftAxisname?: string;
  transform?: string;
  height?: string;
  width?: string;
  margin_top?: number;
  margin_bottom?: number;
  margin_left?: number;
  margin_right?: number;
  topLegendOffset?: number;
  leftLegendOffset?: number;
  topTickRotation?: number;
  graphData: GraphDataItem[];
  displayTestData?: boolean;
  onYAxisClick?: (id: string) => void;
  cellOnClickEvent?: (cell: any) => void;
};

// Функция для преобразования DataStatus в цвет
const statusToColor = (status: DataStatus): string => {
  switch (status) {
    case DataStatus.NO_WRITE:
      return '#FFFFFF'; // white
    case DataStatus.NO_DATA:
      return '#cccccc'; // black
    case DataStatus.NO_SIGNAL:
      return '#FFFFFF'; // grey
    case DataStatus.COMPLETE:
      return '#00FF00'; // green
    case DataStatus.MINOR_HOLES:
      return '#FFA500'; // orange
    case DataStatus.MAJOR_HOLES:
      return '#FF0000'; // red
    default:
      return '#0000FF'; // blue
  }
};

// Кастомный компонент для меток оси
const CustomTick = ({ tick, onYAxisClick }: any): JSX.Element => {
  const theme = useTheme();

  const handleClick = (id: string): void => {
    onYAxisClick(id);
  };

  return (
    <g transform={`translate(0,${tick.y})`}>
      <line x1="0" x2="-5" y1="0" y2="0" stroke="#333" strokeWidth={1.5} />
      <text
        onClick={() => handleClick(tick.value)}
        textAnchor="end"
        transform="translate(-10,0) rotate(0)"
        dominantBaseline="central"
        style={{
          ...theme.axis.ticks.text,
          fill: '#333',
          fontSize: 14,
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        {tick.value}
      </text>
    </g>
  );
};

const GraphSignalTypesData: React.FC<GraphSignalTypesDataProps> = ({
  topAxisname = '',
  leftAxisname = '',
  topTickRotation = 0,
  transform = '0',
  height = '100%',
  width = '100%',
  margin_top = 30,
  margin_bottom = 30,
  margin_left = 30,
  margin_right = 30,
  topLegendOffset = -50,
  leftLegendOffset = -40,
  displayTestData = true,
  graphData,
  onYAxisClick,
  cellOnClickEvent,
}) => {
  const completedGraphData = completeData(graphData);
  const [localDisplayTestData, setLocalDisplayTestData] = useState(displayTestData);

  const { t } = useTranslation();

  useEffect(() => {
    if (
      graphData !== testMainGraphData &&
      graphData !== testSatSigData &&
      graphData !== testSigTimeData
    ) {
      setLocalDisplayTestData(false);
    } else {
      setLocalDisplayTestData(true);
    }
  }, [graphData]);

  return (
    <div style={{ height, width, transform, position: 'relative' }}>
      <ResponsiveHeatMap
        data={completedGraphData}
        margin={{ top: margin_top, right: margin_right, bottom: margin_bottom, left: margin_left }}
        colors={({ value }) => statusToColor(value)}
        borderWidth={2}
        enableLabels={false}
        borderColor="#666666"
        inactiveOpacity={0.3}
        forceSquare
        onClick={cellOnClickEvent}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          legend: topAxisname,
          legendPosition: 'middle',
          legendOffset: topLegendOffset,
          tickRotation: topTickRotation,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: leftAxisname,
          legendPosition: 'middle',
          legendOffset: leftLegendOffset,
          renderTick: onYAxisClick
            ? (tick): JSX.Element => <CustomTick tick={tick} onYAxisClick={onYAxisClick} />
            : undefined,
        }}
      />
      <div
        style={{
          display: localDisplayTestData ? 'flex' : 'none',
          position: 'absolute',
          height: '100%',
          width: '100%',
          backgroundColor: 'black',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.6,
          fontSize: '4vw',
          textAlign: 'center',
          color: 'red',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {t('graph.graphExample')}
      </div>
    </div>
  );
};

export default GraphSignalTypesData;
