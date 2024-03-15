import { Box, Button, Checkbox, Group, Select, Stack, Text } from '@mantine/core';
import { type FC } from 'react';
import { z } from 'zod';
import { assert, isFile } from '@repo/lib/typescript';
import { useAsyncCallback } from '@repo/lib/react';
import { notification } from '@repo/lib/notification';
import {
  type SubmitHandler,
  useForm,
  Controller,
  useFieldArray,
  FormProvider,
  useFormContext,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomButton, CustomFileInput } from '@repo/ui';
import {
  FILE_ACCEPT,
  navigationMeasurementData,
  navigationSystemMap,
  timeStepData,
} from './config';
import {
  type NavigationOption,
  NavigationType,
  api,
  type TimeStep,
  type CalculateData,
} from '../../api';
import { downloadFile } from '../../lib/file';

type FormValues = {
  rinexFile: Nullable<File>;
  navFile: Nullable<File>;
  navigationOptions: NavigationOption[];
  timeStep: Nullable<TimeStep>;
};

const FileFields: FC = () => {
  const { control, setValue, clearErrors } = useFormContext<FormValues>();

  const [, uploadRinexFile, { isLoading: isRinexFileLoading }] = useAsyncCallback(
    async ({ formData }: { formData: FormData; file: File }) => api.uploadRinexFile(formData),
    {
      onSuccess: (_, [{ file }]) => {
        setValue('rinexFile', file);
        clearErrors('rinexFile');
      },
      onError: () =>
        notification.error({
          title: 'Ошибка!',
          message: 'Произошла ошибка при загрузке rinex файла 😔',
        }),
    },
  );

  const [, uploadNavFile, { isLoading: isNavFileLoading }] = useAsyncCallback(
    async ({ formData }: { formData: FormData; file: File }) => api.uploadNavFile(formData),
    {
      onSuccess: (_, [{ file }]) => {
        setValue('navFile', file);
        clearErrors('navFile');
      },
      onError: () =>
        notification.error({
          title: 'Ошибка!',
          message: 'Произошла ошибка при загрузке nav файла 😔',
        }),
    },
  );

  const fileChangeHandler = (type: 'rinex' | 'nav') => async (file: Nullable<File>) => {
    if (!file) {
      setValue(type === 'rinex' ? 'rinexFile' : 'navFile', file);
      return;
    }

    const buffer = await file.arrayBuffer();
    const blob = new Blob([new Uint8Array(buffer)], { type: 'application/octet-stream' });
    const formData = new FormData();
    formData.append('rinex', blob, file.name);

    if (type === 'rinex') {
      uploadRinexFile({ formData, file });
    } else if (type === 'nav') {
      uploadNavFile({ formData, file });
    }
  };

  return (
    <>
      <Controller
        name="rinexFile"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <CustomFileInput
            {...field}
            onChange={fileChangeHandler('rinex')}
            label="Rinex файл"
            placeholder="Загрузить файл"
            accept={FILE_ACCEPT}
            isLoading={isRinexFileLoading}
            error={error?.message}
            withAsterisk
            clearable
          />
        )}
      />
      <Controller
        name="navFile"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <CustomFileInput
            {...field}
            onChange={fileChangeHandler('nav')}
            label="Nav файл"
            placeholder="Загрузить файл"
            accept={FILE_ACCEPT}
            isLoading={isNavFileLoading}
            error={error?.message}
            withAsterisk
            clearable
          />
        )}
      />
    </>
  );
};

const NavigationOptionFields: FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>();
  const { fields } = useFieldArray({ control, name: 'navigationOptions' });

  const checkboxGroups = fields.map((field, index) => (
    <Controller
      key={field.id}
      name={`navigationOptions.${index}`}
      control={control}
      // eslint-disable-next-line @typescript-eslint/no-shadow
      render={({ field }) => (
        <Checkbox.Group
          label={navigationSystemMap[field.value.type]}
          value={field.value.measurements}
          onChange={(value) => field.onChange({ ...field.value, measurements: value })}
        >
          <Group mt="xs">
            {navigationMeasurementData.map((item) => (
              <Checkbox key={item} label={item} value={item} />
            ))}
          </Group>
        </Checkbox.Group>
      )}
    />
  ));

  const error = errors.navigationOptions?.root?.message;

  return (
    <div>
      <Text size="sm" fw={500}>
        Опции для расчета: <span style={{ color: 'red' }}>*</span>
      </Text>
      <Stack gap="xs">{checkboxGroups}</Stack>
      {error && (
        <Text size="xs" c="red" mt="xs">
          {error}
        </Text>
      )}
    </div>
  );
};

const TimeStepSelect: FC = () => {
  const { control } = useFormContext<FormValues>();

  return (
    <Controller
      name="timeStep"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Select
          {...field}
          value={String(field.value)}
          onChange={(value) => {
            field.onChange(Number(value));
          }}
          label="Временной промежуток"
          placeholder="Выберите временной промежуток"
          data={timeStepData}
          error={error?.message}
        />
      )}
    />
  );
};

const formSchema = z.object({
  rinexFile: z.any().refine(isFile, 'Rinex файл обязателен'),
  navFile: z.any().refine(isFile, 'Nav файл обязателен'),
  navigationOptions: z
    .array(
      z.object({
        type: z.string(),
        measurements: z.array(z.string()),
      }),
    )
    .refine(
      (options) => options.some((option) => option.measurements.length > 0),
      'Обязательно выбрать хотя бы одну опцию',
    ),
  timeStep: z
    .number()
    .nullable()
    .refine((value) => value !== null, 'Временный промежуток обязателен'),
});

export const Form: FC = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      rinexFile: null,
      navFile: null,
      navigationOptions: Object.values(NavigationType).map((type) => ({ type, measurements: [] })),
      timeStep: null,
    },
    resolver: zodResolver(formSchema),
  });

  const [, calculate, { isLoading: isCalculating, isLoaded: isCalculated }] = useAsyncCallback(
    api.calculate,
    {
      onError: () =>
        notification.error({
          title: 'Ошибка!',
          message: 'Произошла ошибка при расчете результата 😔',
        }),
    },
  );

  const [, getResult, { isLoading: isResultLoading }] = useAsyncCallback(api.getResult, {
    onSuccess: (data) => downloadFile({ output: 'rinex-to-csv.zip', content: data }),
    onError: () =>
      notification.error({
        title: 'Ошибка!',
        message: 'Произошла ошибка при получении результата 😔',
      }),
  });

  const submitHandler: SubmitHandler<FormValues> = ({ navigationOptions, timeStep }) => {
    assert(timeStep, 'timeStep must be defined');

    const navigationMap = navigationOptions.reduce(
      (acc, option) => ({ ...acc, [option.type]: option.measurements }),
      {},
    );
    calculate({
      ...navigationMap,
      timestep: timeStep,
    } as CalculateData);
  };

  return (
    <FormProvider {...methods}>
      <Box maw={400}>
        <form onSubmit={methods.handleSubmit(submitHandler)}>
          <Stack>
            <FileFields />
            <NavigationOptionFields />
            <TimeStepSelect />
            <Group>
              <Button type="submit" loading={isCalculating}>
                Рассчитать координаты
              </Button>
              <CustomButton
                tooltip="Сперва нужно рассчитать координаты"
                disabled={!isCalculated}
                loading={isResultLoading}
                onClick={getResult}
              >
                Скачать результат
              </CustomButton>
            </Group>
          </Stack>
        </form>
      </Box>
    </FormProvider>
  );
};
