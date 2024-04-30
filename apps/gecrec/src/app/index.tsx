import { Stack, Title } from '@mantine/core';
import { useState, type FC, type ReactNode, useMemo } from 'react';
import { type GetResultResponse } from '~/api';
import { useTranslation } from '~/lib/i18next';
import { Form, TwoLineChart, OneLineChart } from '~/ui';

const App: FC = () => {
  const [result, setResult] = useState<Nullable<GetResultResponse>>(null);
  const { t } = useTranslation();

  const timestamps = useMemo(() => result?.timestamps.map((value) => value * 1000) ?? [], [result]);

  const renderChart = (): ReactNode => {
    if (result?.rec && result.average_mean_tec) {
      return (
        <TwoLineChart
          seriesNames={['TEC', 'REC']}
          data={[result.average_mean_tec, result.rec]}
          categories={timestamps}
          yAxises={[{ title: 'TEC' }, { title: 'REC', decimalsInFloat: 3 }]}
          xTitle={t('chart.dateTime')}
        />
      );
    }
    if (result?.rec) {
      return (
        <OneLineChart
          seriesName="REC"
          data={result.rec}
          categories={timestamps}
          xTitle={t('chart.dateTime')}
          yAxis={{ title: 'REC', decimalsInFloat: 3 }}
        />
      );
    }
    if (result?.average_mean_tec) {
      return (
        <OneLineChart
          seriesName="TEC"
          data={result.average_mean_tec}
          categories={timestamps}
          xTitle={t('chart.dateTime')}
          yAxis={{ title: 'TEC' }}
        />
      );
    }
    return null;
  };

  return (
    <Stack>
      <Form onSubmit={setResult} />
      {result && (
        <div>
          <Title order={3}>{t('content.resultChart')}</Title>
          {renderChart()}
        </div>
      )}
    </Stack>
  );
};

export default App;
