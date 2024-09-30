import { notification } from '@repo/lib/notification';
import { useAsyncCallback } from '@repo/lib/react';
import { CustomFileInput } from '@repo/ui';
import { Controller, useFormContext } from 'react-hook-form';
import { api } from '~/api';
import { useTranslation } from '~/lib/i18next';
import type { FormValues } from './config';
import type { GraphDataItem } from '../graphs/heatmap/config';
import type { FC } from 'react';

type RinexFileInputProps = {
  updateGraph: (data: GraphDataItem[]) => void;
  setTaskId: (taskId: string) => void;
};

export const RinexFileInput: FC<RinexFileInputProps> = ({ updateGraph, setTaskId }) => {
  const { control, setValue, clearErrors } = useFormContext<FormValues>();
  const { t } = useTranslation();

  const { callCallback: uploadNavFile, isLoading: isRinexFileUploading } = useAsyncCallback(
    async ({ formData }: { formData: FormData; file: File }) => api.uploadNavFile(formData),
    {
      onSuccess: (data, [{ file }]) => {
        setValue('rinexFile', file);
        clearErrors('rinexFile');

        const graphData: GraphDataItem[] = data.graph_data;
        const taskId: string = data.task_id;

        setTaskId(taskId);
        updateGraph(graphData);
      },
      onError: () =>
        notification.error({
          title: t('common.error'),
          message: t('form.rinexUploadError'),
        }),
    },
  );

  const fileChangeHandler = () => async (file: Nullable<File>) => {
    if (!file) {
      return;
    }

    const rinexBuffer = await file.arrayBuffer();
    const rinexBlob = new Blob([new Uint8Array(rinexBuffer)], { type: 'application/octet-stream' });
    const formData = new FormData();
    formData.append('rinexFile', rinexBlob, file.name);

    uploadNavFile({ formData, file });
  };

  return (
    <Controller
      name="rinexFile"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <CustomFileInput
          {...field}
          onChange={fileChangeHandler()}
          withAsterisk
          label={t('form.archive')}
          placeholder={t('form.uploadFile')}
          accept=".zip,.24o"
          loading={isRinexFileUploading}
          error={error?.message && t(error.message)}
          clearable
        />
      )}
    />
  );
};
