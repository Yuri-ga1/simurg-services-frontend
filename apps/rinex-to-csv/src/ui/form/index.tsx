import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Checkbox, Group, Select, Stack, Text } from '@mantine/core';
import { downloadFile } from '@repo/lib/file';
import { notification } from '@repo/lib/notification';
import { useAsyncCallback } from '@repo/lib/react';
import { isFile } from '@repo/lib/typescript';
import { CustomButton, CustomFileInput } from '@repo/ui';
import { type FC } from 'react';
import {
  type SubmitHandler,
  useForm,
  Controller,
  useFieldArray,
  FormProvider,
  useFormContext,
} from 'react-hook-form';
import { z } from 'zod';
import {
  type NavigationOption,
  NavigationType,
  api,
  type CalculateCoordinatesData,
} from '../../api';
import { useTranslation } from '../../lib/i18next';
import {
  FILE_ACCEPT,
  navigationMeasurementData,
  navigationSystemMap,
  getTimeStepData,
} from './config';

const formSchema = z.object({
  rinexFile: z.any().refine(isFile, 'form.fieldRequired'),
  navFile: z.any().refine(isFile, 'form.fieldRequired'),
  navigationOptions: z
    .array(
      z.object({
        type: z.string(),
        measurements: z.array(z.string()),
      }),
    )
    .refine(
      (options) => options.some((option) => option.measurements.length > 0),
      'form.optionRequired',
    ),
  timeStep: z.number({ required_error: 'form.fieldRequired' }),
});

export type FormValues = z.infer<typeof formSchema>;

export const Form: FC = () => {
  const methods = useForm<FormValues>({
    defaultValues: {
      navigationOptions: Object.values(NavigationType).map((type) => ({ type, measurements: [] })),
    },
    resolver: zodResolver(formSchema),
  });
  const { t } = useTranslation();

  const {
    callCallback: calculateCoordinates,
    isLoading: isCoordinatesCalculating,
    isFulfilled: isCoordinatesCalculated,
  } = useAsyncCallback(api.calculateCoordinates, {
    onSuccess: () =>
      notification.success({
        title: t('common.success'),
        message: t('form.calculateCoordinatesSuccess'),
      }),
    onError: () =>
      notification.error({
        title: t('common.error'),
        message: t('form.calculateCoordinatesError'),
      }),
  });

  const { callCallback: getResult, isLoading: isResultLoading } = useAsyncCallback(api.getResult, {
    onSuccess: (data) => downloadFile({ output: 'rinex-to-csv.zip', content: data }),
    onError: () =>
      notification.error({
        title: t('common.error'),
        message: t('form.getResultError'),
      }),
  });

  const submitHandler: SubmitHandler<FormValues> = ({ navigationOptions, timeStep }) => {
    const navigationMap = navigationOptions.reduce(
      (acc, option) => ({ ...acc, [option.type]: option.measurements }),
      {},
    );
    calculateCoordinates({
      ...navigationMap,
      timestep: timeStep,
    } as CalculateCoordinatesData);
  };

  return (
    <FormProvider {...methods}>
      <Box maw={500}>
        <form onSubmit={methods.handleSubmit(submitHandler)}>
          <Stack>
            <FileFields />
            <NavigationOptionFields />
            <TimeStepSelect />
            <Group>
              <Button type="submit" loading={isCoordinatesCalculating} style={{ flex: 1 }}>
                {t('form.calculateCoordinates')}
              </Button>
              <CustomButton
                tooltip={t('form.getResultTooltip')}
                disabled={!isCoordinatesCalculated}
                loading={isResultLoading}
                onClick={getResult}
                styles={{
                  root: {
                    flex: 1,
                    width: '100%',
                  },
                  tooltipWrapper: {
                    flex: 1,
                  },
                }}
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

const FileFields: FC = () => {
  const { control, setValue, clearErrors } = useFormContext<FormValues>();
  const { t } = useTranslation();

  const {
    data: rinexFileData,
    callCallback: uploadRinexFile,
    isLoading: isRinexFileLoading,
  } = useAsyncCallback(
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

  const { callCallback: uploadNavFile, isLoading: isNavFileLoading } = useAsyncCallback(
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
            withAsterisk
            label={t('form.rinexFile')}
            placeholder={t('form.uploadFile')}
            accept={FILE_ACCEPT}
            loading={isRinexFileLoading}
            error={error?.message && t(error.message)}
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
            withAsterisk
            label={t('form.navFile')}
            placeholder={t('form.uploadFile')}
            accept={FILE_ACCEPT}
            loading={isNavFileLoading}
            disabled={!rinexFileData}
            error={error?.message && t(error.message)}
            tooltip={t('form.rinexFilePlaceholder')}
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

  const checkboxGroups = fields.map((arrayField, index) => (
    <Controller
      key={arrayField.id}
      name={`navigationOptions.${index}`}
      control={control}
      render={({ field }) => (
        <Checkbox.Group
          label={navigationSystemMap[field.value.type as NavigationOption['type']]}
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

  const timeStepData = getTimeStepData(t);

  return (
    <Controller
      name="timeStep"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Select
          {...field}
          withAsterisk
          value={String(field.value)}
          onChange={(value) => field.onChange(Number(value))}
          label={t('form.timeStep')}
          placeholder={t('form.timeStepPlaceholder')}
          data={timeStepData}
          error={error?.message && t(error.message)}
        />
      )}
    />
  );
};
