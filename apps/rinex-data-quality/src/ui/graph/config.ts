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
