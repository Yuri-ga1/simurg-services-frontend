import { useMantineTheme } from '@mantine/core';
import { type FC, useMemo } from 'react';
import { type ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

const TEC_COLOR = '#008FFB';
const REC_COLOR = '#00E396';

export type ChartProps = {
  tec: number[];
  rec: number[];
  timestamps: number[];
};

export const Chart: FC<ChartProps> = ({ timestamps, tec, rec }) => {
  const theme = useMantineTheme();
  const options = useMemo<ApexOptions>(
    () => ({
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
        colors: [TEC_COLOR, REC_COLOR],
      },
      xaxis: {
        title: {
          text: 'Дата и время',
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
      yaxis: [
        {
          title: {
            text: 'TEC',
            style: {
              color: TEC_COLOR,
              fontFamily: theme.fontFamily,
              fontSize: theme.fontSizes.md,
              fontWeight: 500,
            },
          },
          decimalsInFloat: 0,
          labels: {
            style: {
              colors: TEC_COLOR,
            },
          },
          axisBorder: {
            show: true,
            color: TEC_COLOR,
          },
        },
        {
          title: {
            text: 'REC',
            style: {
              color: REC_COLOR,
              fontFamily: theme.fontFamily,
              fontSize: theme.fontSizes.md,
              fontWeight: 500,
            },
          },
          decimalsInFloat: 3,
          labels: {
            style: {
              colors: REC_COLOR,
            },
          },
          axisBorder: {
            show: true,
            color: REC_COLOR,
          },
        },
      ],
      tooltip: {
        y: {
          formatter: (value) => value.toString(),
        },
      },
    }),
    [theme, timestamps],
  );

  return (
    <ReactApexChart
      options={options}
      series={[
        {
          name: 'TEC',
          data: tec,
          type: 'line',
        },
        {
          name: 'REC',
          data: rec,
          type: 'line',
        },
      ]}
      width={1000}
      height={500}
    />
  );
};
