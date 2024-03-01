import { useState, type FC } from 'react';
import * as yup from 'yup';
import { useForm } from '@mantine/form';
import { yupResolver } from 'mantine-form-yup-resolver';
import { Box, Button, FileInput, Text } from '@mantine/core';
import { assert } from '@internal/shared/lib/typescript';
import { notification } from '@internal/shared/lib/notification';
import { api, type CoordinateCalculationResult } from '../api';

type FormValues = {
  obsFile: Nullable<File>;
  navFile: Nullable<File>;
};

const formSchema = yup.object({
  obsFile: yup.mixed().required('Obs is required'),
  navFile: yup.mixed().required('Nav is required'),
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ obsFile, navFile }: FormValues): Promise<void> => {
    assert(obsFile && navFile, 'Obs and nav files must be defined');

    const obsBuffer = await obsFile.arrayBuffer();
    const navBuffer = await navFile.arrayBuffer();
    const obsBlob = new Blob([new Uint8Array(obsBuffer)], { type: 'application/octet-stream' });
    const navBlob = new Blob([new Uint8Array(navBuffer)], { type: 'application/octet-stream' });

    const formData = new FormData();
    formData.append('obsfile', obsBlob, obsFile.name);
    formData.append('navfile', navBlob, navFile.name);

    try {
      setLoading(true);
      const data = await api.calculateCoordinates(formData);
      setResult(data);
    } catch {
      notification.error({
        title: 'Error!',
        message: 'There was an error in calculating coordinates 😔',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maw={400}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <FileInput
          label="Obs file"
          placeholder="Upload file"
          withAsterisk
          accept=".17o"
          disabled={loading}
          {...form.getInputProps('obsFile')}
        />
        <FileInput
          label="Nav file"
          placeholder="Upload file"
          withAsterisk
          mt="md"
          accept=".17n"
          disabled={loading}
          {...form.getInputProps('navFile')}
        />
        <Button type="submit" mt="md" loading={loading}>
          Calculate coordinates
        </Button>
      </form>
      {result && <Text mt="md">{JSON.stringify(result)}</Text>}
    </Box>
  );
};
