import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Select, Stack } from '@mantine/core';
import { notification } from '@repo/lib/notification';
import { useAsyncCallback } from '@repo/lib/react';
import {
  useForm,
  Controller,
  FormProvider,
  useFormContext,
  type SubmitHandler,
} from 'react-hook-form';
import { api } from '~/api';
import { useTranslation } from '~/lib/i18next';
import { type FormValues, formSchema, getGraphTSData } from './config';
import { RinexFileInput } from './RinexFileInput';
import type { GraphDataItem } from '../graphs/heatmap/config';
import type { FC } from 'react';

type FormProps = {
  onSubmit: (result: GraphDataItem[]) => void;
  setDataPeriod: (dataPeriod: number) => void;
  setMainGraphData: (graphData: GraphDataItem[]) => void;
};

export const Form: FC<FormProps> = ({ onSubmit, setMainGraphData, setDataPeriod }) => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const { handleSubmit } = methods;
  const { t } = useTranslation();

  const { callCallback, isLoading } = useAsyncCallback(api.getDatasForDetailedGraphs, {
    onSuccess: (data) => onSubmit(data),
    onError: () =>
      notification.error({
        title: t('common.error'),
        message: t('form.buildGraphError'),
      }),
  });

  const submitHandler: SubmitHandler<FormValues> = async ({ data_period }): Promise<void> => {
    const formData = new FormData();
    formData.append('data_period', data_period.toString());
    setDataPeriod(data_period);
    callCallback(formData);
  };

  return (
    <Box maw={500}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Stack>
            <RinexFileInput updateGraph={setMainGraphData} />
            <TimeStepSelect />
            <Button type="submit" loading={isLoading}>
              {t('form.uploadNavFile')}
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </Box>
  );
};

const TimeStepSelect: FC = () => {
  const { control } = useFormContext<FormValues>();
  const { t } = useTranslation();

  const graphTSData = getGraphTSData(t);

  return (
    <Controller
      name="data_period"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Select
          {...field}
          withAsterisk
          value={String(field.value)}
          onChange={(value) => field.onChange(Number(value))}
          label={t('form.graphTS')}
          placeholder={t('form.graphTSPlaceholder')}
          data={graphTSData}
          error={error?.message && t(error.message)}
        />
      )}
    />
  );
};
