export type SignalData = {
  tsn: number[];
  seconds: number[];
  signals: string[];
  data: number[][];
  timestep: number;
};

export type LinearGraphData = {
  id: string;
  color: string;
  data: { x: number; y: number }[];
};

type TestLinearGraphData = {
  id: string;
  color: string;
  data: { x: string; y: number }[];
};

export const formatSignalDataForNivo = (
  signal: string,
  signalData: SignalData,
  dataPeriod: number,
  time: string,
): LinearGraphData[] => {
  const { signals, data, seconds, timestep } = signalData;

  const signalIndex = signals.indexOf(signal);
  if (signalIndex === -1) {
    throw new Error(`Signal '${signal}' not found in the signals array.`);
  }

  const startTimeInSeconds = timeToSeconds(time);
  const periodDuration = dataPeriod * 60 - timestep;
  const endTimeInSeconds = startTimeInSeconds + periodDuration;

  const filteredData = data[signalIndex]
    .map((value, idx) => ({
      x: secondsToTime(seconds[idx]),
      y: value,
    }))
    .filter(
      (point) =>
        timeToSeconds(point.x) >= startTimeInSeconds && timeToSeconds(point.x) <= endTimeInSeconds,
    );

  const color = `hsl(${signalIndex * (360 / signals.length)}, 100%, 54%)`;

  const formattedData: LinearGraphData[] = [
    {
      id: signals[signalIndex],
      color,
      data: filteredData,
    },
  ];

  return formattedData;
};

const timeToSeconds = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60;
};

const secondsToTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  const secondsStr = secs.toString().padStart(2, '0');

  return `${hoursStr}:${minutesStr}:${secondsStr}`;
};

export const testLinearData: TestLinearGraphData[] = [
  {
    id: 'C1C',
    color: 'hsl(0, 100%, 54%)',
    data: [
      {
        x: '00:30:00',
        y: 21634500,
      },
      {
        x: '00:30:30',
        y: 21627800,
      },
      {
        x: '00:31:00',
        y: 21621300,
      },
      {
        x: '00:31:30',
        y: 21614900,
      },
      {
        x: '00:32:00',
        y: 21608600,
      },
      {
        x: '00:32:30',
        y: 21602300,
      },
      {
        x: '00:33:00',
        y: 21596100,
      },
      {
        x: '00:33:30',
        y: 21590100,
      },
      {
        x: '00:34:00',
        y: 21584100,
      },
      {
        x: '00:34:30',
        y: 21578200,
      },
      {
        x: '00:35:00',
        y: 21572400,
      },
      {
        x: '00:35:30',
        y: 21566700,
      },
      {
        x: '00:36:00',
        y: 21561100,
      },
      {
        x: '00:36:30',
        y: 21555600,
      },
      {
        x: '00:37:00',
        y: 21550100,
      },
      {
        x: '00:37:30',
        y: 21544800,
      },
      {
        x: '00:38:00',
        y: 21539500,
      },
      {
        x: '00:38:30',
        y: 21534400,
      },
      {
        x: '00:39:00',
        y: 21529300,
      },
      {
        x: '00:39:30',
        y: 21524300,
      },
      {
        x: '00:40:00',
        y: 21519400,
      },
      {
        x: '00:40:30',
        y: 21514600,
      },
      {
        x: '00:41:00',
        y: 21510000,
      },
      {
        x: '00:41:30',
        y: 21505400,
      },
      {
        x: '00:42:00',
        y: 21500800,
      },
      {
        x: '00:42:30',
        y: 21496400,
      },
      {
        x: '00:43:00',
        y: 21492100,
      },
      {
        x: '00:43:30',
        y: 21487900,
      },
      {
        x: '00:44:00',
        y: 21483800,
      },
      {
        x: '00:44:30',
        y: 21479700,
      },
      {
        x: '00:45:00',
        y: 21475800,
      },
      {
        x: '00:45:30',
        y: 21471900,
      },
      {
        x: '00:46:00',
        y: 21468200,
      },
      {
        x: '00:46:30',
        y: 21464500,
      },
      {
        x: '00:47:00',
        y: 21461000,
      },
      {
        x: '00:47:30',
        y: 21457500,
      },
      {
        x: '00:48:00',
        y: 21454100,
      },
      {
        x: '00:48:30',
        y: 21450900,
      },
      {
        x: '00:49:00',
        y: 21447700,
      },
      {
        x: '00:49:30',
        y: 21444600,
      },
      {
        x: '00:50:00',
        y: 21441600,
      },
      {
        x: '00:50:30',
        y: 21438800,
      },
      {
        x: '00:51:00',
        y: 21436000,
      },
      {
        x: '00:51:30',
        y: 21433300,
      },
      {
        x: '00:52:00',
        y: 21430700,
      },
      {
        x: '00:52:30',
        y: 21428200,
      },
      {
        x: '00:53:00',
        y: 21425800,
      },
      {
        x: '00:53:30',
        y: 21423500,
      },
      {
        x: '00:54:00',
        y: 21421300,
      },
      {
        x: '00:54:30',
        y: 21419200,
      },
      {
        x: '00:55:00',
        y: 21417200,
      },
      {
        x: '00:55:30',
        y: 21415300,
      },
      {
        x: '00:56:00',
        y: 21413500,
      },
      {
        x: '00:56:30',
        y: 21411800,
      },
      {
        x: '00:57:00',
        y: 21410200,
      },
      {
        x: '00:57:30',
        y: 21408700,
      },
      {
        x: '00:58:00',
        y: 21407200,
      },
      {
        x: '00:58:30',
        y: 21405900,
      },
      {
        x: '00:59:00',
        y: 21404700,
      },
      {
        x: '00:59:30',
        y: 21403600,
      },
    ],
  },
];
