import { useMantineTheme } from '@mantine/core';
import { type ApexOptions } from 'apexcharts';
import { useMemo, type FC } from 'react';
import ReactApexChart from 'react-apexcharts';

type OneLineChartProps = {
  seriesName: string;
  data: number[];
  categories: number[];
  xTitle: string;
  yAxis: {
    title: string;
    decimalsInFloat?: number;
  };
};

export const OneLineChart: FC<OneLineChartProps> = ({
  seriesName,
  data,
  categories,
  xTitle,
  yAxis,
}) => {
  const theme = useMantineTheme();

  const options = useMemo<ApexOptions>(() => {
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
        width: [2],
        colors: [theme.colors.blue[6]],
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
      yaxis: {
        title: {
          text: yAxis.title,
          style,
        },
        decimalsInFloat: yAxis.decimalsInFloat ?? 0,
        axisBorder: {
          show: true,
        },
      },
      tooltip: {
        y: {
          formatter: (value) => String(value),
        },
      },
    };
  }, [categories, theme, xTitle, yAxis]);

  const series = [{ name: seriesName, data, type: 'line' }];

  return <ReactApexChart series={series} options={options} width={1000} height={500} />;
};
