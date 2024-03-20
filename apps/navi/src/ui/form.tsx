import { type FC } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { Box, Button, FileInput, Stack } from '@mantine/core';
import { isFile } from '@repo/lib/typescript';
import { notification } from '@repo/lib/notification';
import { useAsyncCallback } from '@repo/lib/react';
import { type CoordinateCalculationResponse, api } from '../api';
import { useTranslation } from '../lib/i18next';

const formSchema = z.object({
  obsFile: z.any().refine(isFile, 'form.fieldRequired'),
  navFile: z.any().refine(isFile, 'form.fieldRequired'),
});

type FormValues = z.infer<typeof formSchema>;

type FormProps = {
  onSubmit: (result: CoordinateCalculationResponse) => void;
};

export const Form: FC<FormProps> = ({ onSubmit }) => {
  const { control, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const { t } = useTranslation();

  const { callCallback, isLoading } = useAsyncCallback(api.calculateCoordinates, {
    onSuccess: (data) => onSubmit(data),
    onError: () =>
      notification.error({
        title: t('common.error'),
        message: t('form.calculateCoordinatesError'),
      }),
  });

  const submitHandler: SubmitHandler<FormValues> = async ({ obsFile, navFile }): Promise<void> => {
    const obsBuffer = await obsFile.arrayBuffer();
    const navBuffer = await navFile.arrayBuffer();
    const obsBlob = new Blob([new Uint8Array(obsBuffer)], { type: 'application/octet-stream' });
    const navBlob = new Blob([new Uint8Array(navBuffer)], { type: 'application/octet-stream' });

    const formData = new FormData();
    formData.append('obsfile', obsBlob, obsFile.name);
    formData.append('navfile', navBlob, navFile.name);
    callCallback(formData);
  };

  return (
    <Box maw={500}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Stack>
          <Controller
            name="obsFile"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FileInput
                {...field}
                label={t('form.obsFile')}
                placeholder={t('form.uploadFile')}
                withAsterisk
                accept=".17o"
                disabled={isLoading}
                error={error?.message && t(error.message)}
                clearable
              />
            )}
          />
          <Controller
            name="navFile"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FileInput
                {...field}
                label={t('form.navFile')}
                placeholder={t('form.uploadFile')}
                withAsterisk
                accept=".17n"
                disabled={isLoading}
                error={error?.message && t(error.message)}
                clearable
              />
            )}
          />
          <Button type="submit" loading={isLoading}>
            {t('form.calculateCoordinates')}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};
