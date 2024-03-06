import { useState, type FC } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { Box, Button, FileInput, Text } from '@mantine/core';
import { assert, isFile } from '@repo/lib/typescript';
import { notification } from '@repo/lib/notification';
import { api, type CoordinateCalculationResult } from '../api';
import { useTranslation } from '../lib/i18next';

type FormData = {
  obsFile: Nullable<File>;
  navFile: Nullable<File>;
};

const schema = z.object({
  obsFile: z.any().refine(isFile, 'form.obsFileRequired'),
  navFile: z.any().refine(isFile, 'form.navFileRequired'),
});

export const Form: FC = () => {
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      obsFile: null,
      navFile: null,
    },
    resolver: zodResolver(schema),
  });
  const [result, setResult] = useState<Nullable<CoordinateCalculationResult>>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<FormData> = async ({ obsFile, navFile }): Promise<void> => {
    assert(obsFile && navFile, 'Obs and nav files must be defined');

    const obsBuffer = await obsFile.arrayBuffer();
    const navBuffer = await navFile.arrayBuffer();
    const obsBlob = new Blob([new Uint8Array(obsBuffer)], { type: 'application/octet-stream' });
    const navBlob = new Blob([new Uint8Array(navBuffer)], { type: 'application/octet-stream' });

    const formData = new FormData();
    formData.append('obsfile', obsBlob, obsFile.name);
    formData.append('navfile', navBlob, navFile.name);

    try {
      setIsLoading(true);
      const data = await api.calculateCoordinates(formData);
      setResult(data);
    } catch {
      notification.error({
        title: `${t('common.error')}!`,
        message: `${t('form.calculateCoordinatesError')} 😔`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maw={400}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
              mt="md"
              accept=".17n"
              disabled={isLoading}
              error={error?.message && t(error.message)}
              clearable
            />
          )}
        />
        <Button type="submit" mt="md" loading={isLoading}>
          {t('form.calculateCoordinates')}
        </Button>
      </form>
      {result && <Text mt="md">{JSON.stringify(result)}</Text>}
    </Box>
  );
};
