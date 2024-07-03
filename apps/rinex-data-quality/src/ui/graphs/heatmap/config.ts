export enum DataStatus {
  NO_WRITE = 'No Write', // не представлен в системе
  NO_SIGNAL = 'No signal', // представлен в системе, но не пишет со спутника  grey колонки равные полностью нулю
  NO_DATA = 'No Data',
  COMPLETE = 'Complete',
  MINOR_HOLES = '1-3 Holes',
  MAJOR_HOLES = '4+ Holes',
}

export type GraphDataItem = {
  id: string;
  data: Array<{ x: string; y: DataStatus }>;
};

export const getStatus = (val: number): string => {
  const statusMap: Record<number, string> = {
    '-1': DataStatus.NO_DATA,
    '0': DataStatus.COMPLETE,
    '1': DataStatus.MINOR_HOLES,
    '2': DataStatus.MINOR_HOLES,
    '3': DataStatus.MINOR_HOLES,
  };

  // Если значение val больше или равно 4, возвращаем MAJOR_HOLES
  if (val >= 4) {
    return DataStatus.MAJOR_HOLES;
  }

  // Если значение есть в объекте statusMap, возвращаем соответствующий статус
  if (statusMap[val.toString()]) {
    return statusMap[val.toString()];
  }

  // Возвращаем 'undefined' по умолчанию
  return 'undefined';
};

export const completeData = (data: GraphDataItem[]): GraphDataItem[] => {
  // Получаем все уникальные значения 'x' из всех элементов данных
  const uniqueXValues = Array.from(new Set(data.flatMap((item) => item.data.map((d) => d.x))));

  return data.map((item) => {
    // Создаем объект для быстрого поиска существующих значений 'x' в текущем элементе
    const existingXValues = new Set(item.data.map((d) => d.x));

    // Создаем новый массив данных, включая отсутствующие значения 'x'
    const newData = uniqueXValues.map((x) => {
      let value;
      if (existingXValues.has(x)) {
        // Если значение 'x' уже существует, возвращаем его
        value = item.data.find((d) => d.x === x)!;
      } else {
        // Если значение 'x' отсутствует, добавляем его с 'DataStatus.NO_WRITE'
        value = { x, y: DataStatus.NO_WRITE };
      }
      return value;
    });

    return { ...item, data: newData };
  });
};

export const testMainGraphData: GraphDataItem[] = [
  {
    id: 'G',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'R',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C1P', y: DataStatus.COMPLETE },
      { x: 'L1P', y: DataStatus.COMPLETE },
      { x: 'C2C', y: DataStatus.COMPLETE },
      { x: 'L2C', y: DataStatus.COMPLETE },
      { x: 'C2P', y: DataStatus.COMPLETE },
      { x: 'L2P', y: DataStatus.COMPLETE },
      { x: 'C3X', y: DataStatus.COMPLETE },
      { x: 'L3X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'E',
    data: [
      { x: 'C1X', y: DataStatus.COMPLETE },
      { x: 'L1X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
      { x: 'C7X', y: DataStatus.COMPLETE },
      { x: 'L7X', y: DataStatus.COMPLETE },
      { x: 'C8X', y: DataStatus.COMPLETE },
      { x: 'L8X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'C',
    data: [
      { x: 'C1I', y: DataStatus.COMPLETE },
      { x: 'L1I', y: DataStatus.COMPLETE },
      { x: 'C7I', y: DataStatus.COMPLETE },
      { x: 'L7I', y: DataStatus.COMPLETE },
    ],
  },
];

export const testSatSigData: GraphDataItem[] = [
  {
    id: 'G02',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.NO_SIGNAL },
      { x: 'L2X', y: DataStatus.NO_SIGNAL },
      { x: 'C5X', y: DataStatus.NO_SIGNAL },
      { x: 'L5X', y: DataStatus.NO_SIGNAL },
    ],
  },
  {
    id: 'G03',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'G04',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'G05',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.NO_SIGNAL },
      { x: 'L5X', y: DataStatus.NO_SIGNAL },
    ],
  },
  {
    id: 'G06',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'G07',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.NO_SIGNAL },
      { x: 'L5X', y: DataStatus.NO_SIGNAL },
    ],
  },
  {
    id: 'G08',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'G09',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'G10',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'G11',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'G12',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.NO_SIGNAL },
      { x: 'L5X', y: DataStatus.NO_SIGNAL },
    ],
  },
  {
    id: 'G13',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.NO_SIGNAL },
      { x: 'L2X', y: DataStatus.NO_SIGNAL },
      { x: 'C5X', y: DataStatus.NO_SIGNAL },
      { x: 'L5X', y: DataStatus.NO_SIGNAL },
    ],
  },
  {
    id: 'G14',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'G15',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.NO_SIGNAL },
      { x: 'L5X', y: DataStatus.NO_SIGNAL },
    ],
  },
  {
    id: 'G16',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.NO_SIGNAL },
      { x: 'L5X', y: DataStatus.NO_SIGNAL },
    ],
  },
  {
    id: 'G17',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'G18',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'G19',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.NO_SIGNAL },
      { x: 'L2X', y: DataStatus.NO_SIGNAL },
      { x: 'C5X', y: DataStatus.NO_SIGNAL },
      { x: 'L5X', y: DataStatus.NO_SIGNAL },
    ],
  },
  {
    id: 'G20',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.NO_SIGNAL },
      { x: 'L2X', y: DataStatus.NO_SIGNAL },
      { x: 'C5X', y: DataStatus.NO_SIGNAL },
      { x: 'L5X', y: DataStatus.NO_SIGNAL },
    ],
  },
  {
    id: 'G21',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.NO_SIGNAL },
      { x: 'L5X', y: DataStatus.NO_SIGNAL },
    ],
  },
  {
    id: 'G22',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'G23',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'G24',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.NO_SIGNAL },
      { x: 'L2X', y: DataStatus.NO_SIGNAL },
      { x: 'C5X', y: DataStatus.NO_SIGNAL },
      { x: 'L5X', y: DataStatus.NO_SIGNAL },
    ],
  },
  {
    id: 'G25',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.NO_SIGNAL },
      { x: 'L2X', y: DataStatus.NO_SIGNAL },
      { x: 'C5X', y: DataStatus.NO_SIGNAL },
      { x: 'L5X', y: DataStatus.NO_SIGNAL },
    ],
  },
  {
    id: 'G26',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'G27',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
    ],
  },
  {
    id: 'G28',
    data: [
      { x: 'C1C', y: DataStatus.COMPLETE },
      { x: 'L1C', y: DataStatus.COMPLETE },
      { x: 'C2W', y: DataStatus.COMPLETE },
      { x: 'L2W', y: DataStatus.COMPLETE },
      { x: 'C2X', y: DataStatus.COMPLETE },
      { x: 'L2X', y: DataStatus.COMPLETE },
      { x: 'C5X', y: DataStatus.COMPLETE },
      { x: 'L5X', y: DataStatus.COMPLETE },
    ],
  },
];

export const testSigTimeData: GraphDataItem[] = [
  {
    id: '00:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '00:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '01:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '01:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '02:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '02:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '03:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '03:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '04:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '04:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '05:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '05:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '06:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '06:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '07:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '07:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '08:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '08:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '09:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '09:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '10:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '10:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '11:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '11:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '12:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '12:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '13:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '13:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '14:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '14:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '15:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '15:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '16:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '16:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '17:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '17:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '18:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '18:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '19:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '19:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.MINOR_HOLES,
      },
      {
        x: 'L7I',
        y: DataStatus.MINOR_HOLES,
      },
    ],
  },
  {
    id: '20:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '20:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '21:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '21:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '22:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '22:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.MINOR_HOLES,
      },
      {
        x: 'L7I',
        y: DataStatus.MINOR_HOLES,
      },
    ],
  },
  {
    id: '23:00',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
  {
    id: '23:30',
    data: [
      {
        x: 'C7I',
        y: DataStatus.COMPLETE,
      },
      {
        x: 'L7I',
        y: DataStatus.COMPLETE,
      },
    ],
  },
];
