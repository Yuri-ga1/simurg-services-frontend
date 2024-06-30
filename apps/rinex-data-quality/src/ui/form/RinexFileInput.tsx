import { notification } from '@repo/lib/notification';
import { useAsyncCallback } from '@repo/lib/react';
import { CustomFileInput } from '@repo/ui';
import { Controller, useFormContext } from 'react-hook-form';
import { api } from '~/api';
import { useTranslation } from '~/lib/i18next';
import type { FormValues } from './config';
import type { GraphDataItem } from '../graph/config';
import type { FC } from 'react';

type RinexFileInputProps = {
  updateGraph: (data: GraphDataItem[]) => void;
};

export const RinexFileInput: FC<RinexFileInputProps> = ({ updateGraph }) => {
  const { control, setValue, clearErrors } = useFormContext<FormValues>();
  const { t } = useTranslation();

  const { callCallback: buildGraph, isLoading: isRinexFileUploading } = useAsyncCallback(
    async ({ formData }: { formData: FormData; file: File }) => api.buildGraph(formData),
    {
      onSuccess: (data, [{ file }]) => {
        setValue('rinexFile', file);
        clearErrors('rinexFile');

        updateGraph(data);
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

    buildGraph({ formData, file });
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