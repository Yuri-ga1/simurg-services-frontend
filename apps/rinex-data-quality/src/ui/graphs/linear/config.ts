export type SignalData = {
  tsn: number[];
  seconds: number[];
  elevation: number[];
  signals: string[];
  data: number[][];
  timestep: number;
};

export type LinearGraphData = {
  id: string;
  color: string;
  data: { x: number | string; y: number }[];
};

export const formatSignalDataForNivo = (
  signal: string,
  signalData: SignalData,
  dataPeriod: number,
  time: string,
): LinearGraphData[] => {
  const { signals, data, seconds, timestep, elevation } = signalData;

  const signalIndex = signals.indexOf(signal);
  if (signalIndex === -1) {
    throw new Error(`Signal '${signal}' not found in the signals array.`);
  }

  const startTimeInSeconds = timeToSeconds(time);
  const periodDuration = dataPeriod * 60 - timestep;
  const endTimeInSeconds = startTimeInSeconds + periodDuration;

  const filteredSignalData = data[signalIndex]
    .map((value, idx) => ({
      x: secondsToTime(seconds[idx]),
      y: value,
    }))
    .filter(
      (point) =>
        timeToSeconds(point.x) >= startTimeInSeconds && timeToSeconds(point.x) <= endTimeInSeconds,
    );

  const filteredElevationData = elevation
    .map((value, idx) => ({
      x: secondsToTime(seconds[idx]),
      y: value,
    }))
    .filter(
      (point) =>
        timeToSeconds(point.x) >= startTimeInSeconds && timeToSeconds(point.x) <= endTimeInSeconds,
    );

  const signalColor = `hsl(${signalIndex * (360 / signals.length)}, 100%, 54%)`;
  const elevationColor = `hsl(${(signals.length - 1) * (360 / signals.length)}, 100%, 54%)`;

  const formattedSignalData: LinearGraphData = {
    id: signals[signalIndex],
    signalColor,
    data: filteredSignalData,
  };

  const formattedElevationData: LinearGraphData = {
    id: 'elevation',
    color: elevationColor,
    data: filteredElevationData,
  };

  return [formattedSignalData, formattedElevationData];
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

export const testElevationData: LinearGraphData[] = [
  {
    id: 'elevation',
    color: 'hsl(315, 100%, 54%)',
    data: [
      {
        x: '04:30:00',
        y: 13.5279,
      },
      {
        x: '04:30:30',
        y: 13.6394,
      },
      {
        x: '04:31:00',
        y: 13.7501,
      },
      {
        x: '04:31:30',
        y: 13.86,
      },
      {
        x: '04:32:00',
        y: 13.9691,
      },
      {
        x: '04:32:30',
        y: 14.0773,
      },
      {
        x: '04:33:00',
        y: 14.1847,
      },
      {
        x: '04:33:30',
        y: 14.2912,
      },
      {
        x: '04:34:00',
        y: 14.3969,
      },
      {
        x: '04:34:30',
        y: 14.5017,
      },
      {
        x: '04:35:00',
        y: 14.6057,
      },
      {
        x: '04:35:30',
        y: 14.7088,
      },
      {
        x: '04:36:00',
        y: 14.811,
      },
      {
        x: '04:36:30',
        y: 14.9124,
      },
      {
        x: '04:37:00',
        y: 15.0128,
      },
      {
        x: '04:37:30',
        y: 15.1124,
      },
      {
        x: '04:38:00',
        y: 15.2111,
      },
      {
        x: '04:38:30',
        y: 15.3089,
      },
      {
        x: '04:39:00',
        y: 15.4057,
      },
      {
        x: '04:39:30',
        y: 15.5017,
      },
      {
        x: '04:40:00',
        y: 15.5968,
      },
      {
        x: '04:40:30',
        y: 15.6909,
      },
      {
        x: '04:41:00',
        y: 15.7841,
      },
      {
        x: '04:41:30',
        y: 15.8763,
      },
      {
        x: '04:42:00',
        y: 15.9677,
      },
      {
        x: '04:42:30',
        y: 16.058,
      },
      {
        x: '04:43:00',
        y: 16.1475,
      },
      {
        x: '04:43:30',
        y: 16.2359,
      },
      {
        x: '04:44:00',
        y: 16.3235,
      },
      {
        x: '04:44:30',
        y: 16.41,
      },
      {
        x: '04:45:00',
        y: 16.4956,
      },
      {
        x: '04:45:30',
        y: 16.5802,
      },
      {
        x: '04:46:00',
        y: 16.6638,
      },
      {
        x: '04:46:30',
        y: 16.7464,
      },
      {
        x: '04:47:00',
        y: 16.8281,
      },
      {
        x: '04:47:30',
        y: 16.9087,
      },
      {
        x: '04:48:00',
        y: 16.9884,
      },
      {
        x: '04:48:30',
        y: 17.067,
      },
      {
        x: '04:49:00',
        y: 17.1446,
      },
      {
        x: '04:49:30',
        y: 17.2212,
      },
      {
        x: '04:50:00',
        y: 17.2968,
      },
      {
        x: '04:50:30',
        y: 17.3714,
      },
      {
        x: '04:51:00',
        y: 17.4449,
      },
      {
        x: '04:51:30',
        y: 17.5174,
      },
      {
        x: '04:52:00',
        y: 17.5889,
      },
      {
        x: '04:52:30',
        y: 17.6593,
      },
      {
        x: '04:53:00',
        y: 17.7287,
      },
      {
        x: '04:53:30',
        y: 17.797,
      },
      {
        x: '04:54:00',
        y: 17.8642,
      },
      {
        x: '04:54:30',
        y: 17.9304,
      },
      {
        x: '04:55:00',
        y: 17.9956,
      },
      {
        x: '04:55:30',
        y: 18.0596,
      },
      {
        x: '04:56:00',
        y: 18.1226,
      },
      {
        x: '04:56:30',
        y: 18.1845,
      },
      {
        x: '04:57:00',
        y: 18.2453,
      },
      {
        x: '04:57:30',
        y: 18.3051,
      },
      {
        x: '04:58:00',
        y: 18.3637,
      },
      {
        x: '04:58:30',
        y: 18.4213,
      },
      {
        x: '04:59:00',
        y: 18.4777,
      },
      {
        x: '04:59:30',
        y: 18.5331,
      },
    ],
  },
];

export const testLinearData: LinearGraphData[] = [
  {
    id: 'C1C',
    color: 'hsl(0, 100%, 54%)',
    data: [
      { x: '00:30:00', y: 21634500 },
      { x: '00:30:30', y: 21627800 },
      { x: '00:31:00', y: 21621300 },
      { x: '00:31:30', y: 21614900 },
      { x: '00:32:00', y: 21608600 },
      { x: '00:32:30', y: 21602300 },
      { x: '00:33:00', y: 21596100 },
      { x: '00:33:30', y: 21590100 },
      { x: '00:34:00', y: 21584100 },
      { x: '00:34:30', y: 21578200 },
      { x: '00:35:00', y: 21572400 },
      { x: '00:35:30', y: 21566700 },
      { x: '00:36:00', y: 21561100 },
      { x: '00:36:30', y: 21555600 },
      { x: '00:37:00', y: 21550100 },
      { x: '00:37:30', y: 21544800 },
      { x: '00:38:00', y: 21539500 },
      { x: '00:38:30', y: 21534400 },
      { x: '00:39:00', y: 21529300 },
      { x: '00:39:30', y: 21524300 },
      { x: '00:40:00', y: 21519400 },
      { x: '00:40:30', y: 21514600 },
      { x: '00:41:00', y: 21510000 },
      { x: '00:41:30', y: 21505400 },
      { x: '00:42:00', y: 21500800 },
      { x: '00:42:30', y: 21496400 },
      { x: '00:43:00', y: 21492100 },
      { x: '00:43:30', y: 21487900 },
      { x: '00:44:00', y: 21483800 },
      { x: '00:44:30', y: 21479700 },
      { x: '00:45:00', y: 21475800 },
      { x: '00:45:30', y: 21471900 },
      { x: '00:46:00', y: 21468200 },
      { x: '00:46:30', y: 21464500 },
      { x: '00:47:00', y: 21461000 },
      { x: '00:47:30', y: 21457500 },
      { x: '00:48:00', y: 21454100 },
      { x: '00:48:30', y: 21450900 },
      { x: '00:49:00', y: 21447700 },
      { x: '00:49:30', y: 21444600 },
      { x: '00:50:00', y: 21441600 },
      { x: '00:50:30', y: 21438800 },
      { x: '00:51:00', y: 21436000 },
      { x: '00:51:30', y: 21433300 },
      { x: '00:52:00', y: 21430700 },
      { x: '00:52:30', y: 21428200 },
      { x: '00:53:00', y: 21425800 },
      { x: '00:53:30', y: 21423500 },
      { x: '00:54:00', y: 21421300 },
      { x: '00:54:30', y: 21419200 },
      { x: '00:55:00', y: 21417200 },
      { x: '00:55:30', y: 21415300 },
      { x: '00:56:00', y: 21413500 },
      { x: '00:56:30', y: 21411800 },
      { x: '00:57:00', y: 21410200 },
      { x: '00:57:30', y: 21408700 },
      { x: '00:58:00', y: 21407200 },
      { x: '00:58:30', y: 21405900 },
      { x: '00:59:00', y: 21404700 },
      { x: '00:59:30', y: 21403600 },
    ],
  },
];
