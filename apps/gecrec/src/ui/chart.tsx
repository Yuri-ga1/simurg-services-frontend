import { useMantineTheme } from '@mantine/core';
import { type FC, useMemo } from 'react';
import { type ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { useTranslation } from '../lib/i18next';

const BLUE = '#008FFB';
const GREEN = '#00E396';

export type ChartProps = {
  tec?: number[];
  rec?: number[];
  timestamps: number[];
};

export const Chart: FC<ChartProps> = ({ timestamps, tec, rec }) => {
  const theme = useMantineTheme();
  const { t } = useTranslation();

  const withTwoAxis = Boolean(rec && tec);

  const options = useMemo<ApexOptions>(() => {
    const width = withTwoAxis ? [2, 2] : [2];
    const colors = withTwoAxis ? [BLUE, GREEN] : [BLUE];
    const recColor = colors.length === 2 ? GREEN : BLUE;
    const yaxis = [
      tec && {
        title: {
          text: 'TEC',
          style: {
            color: BLUE,
            fontFamily: theme.fontFamily,
            fontSize: theme.fontSizes.md,
            fontWeight: 500,
          },
        },
        decimalsInFloat: 0,
        labels: {
          style: {
            colors: BLUE,
          },
        },
        axisBorder: {
          show: true,
          color: BLUE,
        },
      },
      rec && {
        title: {
          text: 'REC',
          style: {
            color: colors,
            fontFamily: theme.fontFamily,
            fontSize: theme.fontSizes.md,
            fontWeight: 500,
          },
        },
        decimalsInFloat: 3,
        labels: {
          style: {
            colors: recColor,
          },
        },
        axisBorder: {
          show: true,
          color: recColor,
        },
      },
    ].filter(Boolean) as [];

    return {
      chart: {
        type: 'line',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        animations: {
          enabled: false,
        },
      },
      stroke: {
        width,
        colors,
      },
      xaxis: {
        title: {
          text: t('chart.dateTime'),
          style: {
            fontFamily: theme.fontFamily,
            fontSize: theme.fontSizes.md,
            fontWeight: 500,
          },
        },
        type: 'datetime',
        categories: timestamps,
        tooltip: {
          enabled: false,
        },
      },
      yaxis,
      tooltip: {
        y: {
          formatter: (value) => String(value),
        },
      },
    };
  }, [t, rec, tec, theme, timestamps, withTwoAxis]);

  const series = [
    tec && {
      name: 'TEC',
      data: tec,
      type: 'line',
    },
    rec && {
      name: 'REC',
      data: rec,
      type: 'line',
    },
  ].filter(Boolean) as [];

  return <ReactApexChart options={options} series={series} width={1000} height={500} />;
};
