import { useState, type FC } from 'react';
import * as yup from 'yup';
import { useForm } from '@mantine/form';
import { yupResolver } from 'mantine-form-yup-resolver';
import { Box, Button, FileInput, Text } from '@mantine/core';
import { assert } from '@simurg-microfrontends/shared/lib/typescript';
import { notification } from '@simurg-microfrontends/shared/lib/notification';
import { api, type CoordinateCalculationResult } from '~/api';

type FormValues = {
  obsFile: Nullable<File>;
  navFile: Nullable<File>;
};

const formSchema = yup.object({
  obsFile: yup.mixed().required('Obs файл обязательный'),
  navFile: yup.mixed().required('Nav файл обязательный'),
});

export const Form: FC = () => {
  const form = useForm<FormValues>({
    initialValues: {
      obsFile: null,
      navFile: null,
    },
    validate: yupResolver(formSchema),
  });
  const [result, setResult] = useState<Nullable<CoordinateCalculationResult>>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: FormValues): Promise<void> => {
    const { obsFile, navFile } = values;
    assert(obsFile && navFile, 'Obs and nav files must be defined');

    const obsBuffer = await obsFile.arrayBuffer();
    const navBuffer = await navFile.arrayBuffer();
    const obsBlob = new Blob([new Uint8Array(obsBuffer)], {
      type: 'application/octet-stream',
    });
    const navBlob = new Blob([new Uint8Array(navBuffer)], {
      type: 'application/octet-stream',
    });

    const formData = new FormData();
    formData.append('obsfile', obsBlob, obsFile.name);
    formData.append('navfile', navBlob, navFile.name);

    try {
      setIsLoading(true);
      const data = await api.calculateCoordinates(formData);
      setResult(data);
    } catch {
      notification.error({
        title: 'Ошибка!',
        message: 'Произошла ошибка при расчете координат 😔',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maw={400}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <FileInput
          label="Obs файл"
          placeholder="Загрузить файл"
          withAsterisk
          accept=".17o"
          disabled={isLoading}
          {...form.getInputProps('obsFile')}
        />
        <FileInput
          label="Nav файл"
          placeholder="Загрузить файл"
          withAsterisk
          mt="md"
          accept=".17n"
          disabled={isLoading}
          {...form.getInputProps('navFile')}
        />
        <Button type="submit" mt="md" loading={isLoading}>
          Рассчитать координаты
        </Button>
      </form>
      {result && <Text mt="md">{JSON.stringify(result)}</Text>}
    </Box>
  );
};
