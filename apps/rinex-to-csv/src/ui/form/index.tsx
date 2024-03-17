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
  getTimeStepData,
} from './config';
import {
  type NavigationOption,
  NavigationType,
  api,
  type TimeStep,
  type CalculateData,
} from '../../api';
import { downloadFile } from '../../lib/file';
import { useTranslation } from '../../lib/i18next';

type FormValues = {
  rinexFile: Nullable<File>;
  navFile: Nullable<File>;
  navigationOptions: NavigationOption[];
  timeStep: Nullable<TimeStep>;
};

const FileFields: FC = () => {
  const { control, setValue, clearErrors } = useFormContext<FormValues>();
  const { t } = useTranslation();

  const [, uploadRinexFile, { isLoading: isRinexFileLoading }] = useAsyncCallback(
    async ({ formData }: { formData: FormData; file: File }) => api.uploadRinexFile(formData),
    {
      onSuccess: (_, [{ file }]) => {
        setValue('rinexFile', file);
        clearErrors('rinexFile');
      },
      onError: () =>
        notification.error({
          title: t('common.error'),
          message: t('form.uploadRinexFileError'),
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
          title: t('common.error'),
          message: t('form.uploadNavFileError'),
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
            label={t('form.rinexFile')}
            placeholder={t('form.uploadFile')}
            accept={FILE_ACCEPT}
            isLoading={isRinexFileLoading}
            error={error?.message && t(error.message)}
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
            label={t('form.navFile')}
            placeholder={t('form.uploadFile')}
            accept={FILE_ACCEPT}
            isLoading={isNavFileLoading}
            error={error?.message && t(error.message)}
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
  const { t } = useTranslation();

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

  const errorMessage = errors.navigationOptions?.root?.message;

  return (
    <div>
      <Text size="sm" fw={500}>
        {t('form.calculationOptions')}: <span style={{ color: 'red' }}>*</span>
      </Text>
      <Stack gap="xs">{checkboxGroups}</Stack>
      {errorMessage && (
        <Text size="xs" c="red" mt="xs">
          {t(errorMessage)}
        </Text>
      )}
    </div>
  );
};

const TimeStepSelect: FC = () => {
  const { control } = useFormContext<FormValues>();
  const { t } = useTranslation();

  const timeStepData = getTimeStepData((timeStep) => t('common.seconds', { value: timeStep }));

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
          label={t('form.timeStep')}
          placeholder={t('form.timeStepPlaceholder')}
          data={timeStepData}
          error={error?.message && t(error.message)}
        />
      )}
    />
  );
};

const formSchema = z.object({
  rinexFile: z.any().refine(isFile, 'form.rinexFileRequired'),
  navFile: z.any().refine(isFile, 'form.navFileRequired'),
  navigationOptions: z
    .array(
      z.object({
        type: z.string(),
        measurements: z.array(z.string()),
      }),
    )
    .refine(
      (options) => options.some((option) => option.measurements.length > 0),
      'form.calculationOptionsRequired',
    ),
  timeStep: z
    .number()
    .nullable()
    .refine((value) => value !== null, 'form.timeStepRequired'),
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
  const { t } = useTranslation();

  const [, calculate, { isLoading: isCalculating, isLoaded: isCalculated }] = useAsyncCallback(
    api.calculate,
    {
      onSuccess: () =>
        notification.success({
          title: t('common.success'),
          message: t('form.calculateSuccess'),
        }),
      onError: () =>
        notification.error({
          title: t('common.error'),
          message: t('form.calculateError'),
        }),
    },
  );

  const [, getResult, { isLoading: isResultLoading }] = useAsyncCallback(api.getResult, {
    onSuccess: (data) => downloadFile({ output: 'rinex-to-csv.zip', content: data }),
    onError: () =>
      notification.error({
        title: t('common.error'),
        message: t('form.getResultError'),
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
                {t('form.calculate')}
              </Button>
              <CustomButton
                tooltip={t('form.getResultTooltip')}
                disabled={!isCalculated}
                loading={isResultLoading}
                onClick={getResult}
              >
                {t('form.getResult')}
              </CustomButton>
            </Group>
          </Stack>
        </form>
      </Box>
    </FormProvider>
  );
};
