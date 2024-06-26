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
import { type BuildGraphResponseFake, api } from '~/api';
import { useTranslation } from '~/lib/i18next';
import { type FormValues, formSchema, getGraphTSData } from './config';
import { RinexFileInput } from './RinexFileInput';
import type { GraphDataItem } from '../graph/config';
import type { FC } from 'react';

type FormProps = {
  onSubmit: (result: BuildGraphResponseFake) => void;
  setGraphData: (graphData: GraphDataItem[]) => void;
};

export const Form: FC<FormProps> = ({ onSubmit, setGraphData }) => {
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

  const submitHandler: SubmitHandler<FormValues> = async ({
    rinexFile,
    data_period,
  }): Promise<void> => {
    const rinexBuffer = await rinexFile.arrayBuffer();
    const rinexBlob = new Blob([new Uint8Array(rinexBuffer)], { type: 'application/octet-stream' });

    const formData = new FormData();
    formData.append('rinexFile', rinexBlob, rinexFile.name);
    formData.append('data_period', data_period.toString());
    callCallback(formData);
  };

  return (
    <Box maw={500}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Stack>
            <RinexFileInput updateGraph={setGraphData} />
            <TimeStepSelect />
            <Button type="submit" loading={isLoading}>
              {t('form.buildGraph')}
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
