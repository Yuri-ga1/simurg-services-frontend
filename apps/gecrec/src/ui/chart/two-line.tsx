import { useMantineTheme } from '@mantine/core';
import { type ApexOptions } from 'apexcharts';
import { useMemo, type FC } from 'react';
import ReactApexChart from 'react-apexcharts';

type YAxis = {
  title: string;
  decimalsInFloat?: number;
};

type TwoLineChartProps = {
  seriesNames: [string, string];
  data: [number[], number[]];
  categories: number[];
  xTitle: string;
  yAxises: [YAxis, YAxis];
};

export const TwoLineChart: FC<TwoLineChartProps> = ({
  seriesNames,
  data,
  categories,
  xTitle,
  yAxises,
}) => {
  const theme = useMantineTheme();

  const options = useMemo<ApexOptions>(() => {
    const colors = [theme.colors.blue[6], theme.colors.green[6]];
    const style = {
      fontFamily: theme.fontFamily,
      fontSize: theme.fontSizes.md,
      fontWeight: 500,
    };

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
        width: [2, 2],
        colors,
      },
      xaxis: {
        title: {
          text: xTitle,
          style,
        },
        type: 'datetime',
        categories,
        tooltip: {
          enabled: false,
        },
      },
      yaxis: [
        {
          title: {
            text: yAxises[0].title,
            style: {
              ...style,
              color: colors[0],
            },
          },
          decimalsInFloat: yAxises[0].decimalsInFloat ?? 0,
          labels: {
            style: {
              colors: colors[0],
            },
          },
          axisBorder: {
            show: true,
            color: colors[0],
          },
        },
        {
          title: {
            text: yAxises[1].title,
            style: {
              ...style,
              color: colors[1],
            },
          },
          decimalsInFloat: yAxises[1].decimalsInFloat ?? 0,
          labels: {
            style: {
              colors: colors[1],
            },
          },
          axisBorder: {
            show: true,
            color: colors[1],
          },
        },
      ],
      tooltip: {
        y: {
          formatter: (value) => String(value),
        },
      },
    };
  }, [categories, theme, xTitle, yAxises]);

  const series = [
    { name: seriesNames[0], data: data[0], type: 'line' },
    { name: seriesNames[1], data: data[1], type: 'line' },
  ];

  return <ReactApexChart series={series} options={options} width={1000} height={500} />;
};
