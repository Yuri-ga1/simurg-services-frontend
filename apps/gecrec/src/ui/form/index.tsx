import { useEffect, type FC } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Group,
  InputLabel,
  Loader,
  NumberInput,
  Radio,
  Select,
  Stack,
  Tooltip,
  Text,
} from '@mantine/core';
import {
  Controller,
  FormProvider,
  type SubmitHandler,
  useForm,
  useFormContext,
} from 'react-hook-form';
import { useAsyncCallback, useMount } from '@repo/lib/react';
import { notification } from '@repo/lib/notification';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CustomDateInput } from '@repo/ui';
import dayjs from 'dayjs';
import { downloadFile } from '@repo/lib/file';
import { type GetResultQuery, api, type GetResultResponse } from '../../api';
import { MAX_LATITUDE, MAX_LONGITUDE, MIN_LATITUDE, MIN_LONGITUDE } from './config';
import { useTranslation } from '../../lib/i18next';

enum GeoMagnitude {
  GEOGRAPHICAL = 'false',
  GEOMAGNETIC = 'true',
}

const formSchema = z.object({
  center: z.string().min(1, { message: 'form.fieldRequired' }),
  dateFrom: z.date({ required_error: 'form.fieldRequired' }),
  dateTo: z.date({ required_error: 'form.fieldRequired' }),
  minLatitude: z.number({ invalid_type_error: 'form.fieldRequired' }),
  maxLatitude: z.number({ invalid_type_error: 'form.fieldRequired' }),
  minLongitude: z.number({ invalid_type_error: 'form.fieldRequired' }),
  maxLongitude: z.number({ invalid_type_error: 'form.fieldRequired' }),
  geoMagnitude: z.string(),
  dataTransfer: z
    .object({
      isNeedToSendRec: z.boolean(),
      isNeedToSendWmt: z.boolean(),
    })
    .refine((data) => data.isNeedToSendRec || data.isNeedToSendWmt, 'form.optionRequired'),
});

type FormValues = z.infer<typeof formSchema>;

type FormProps = {
  onSubmit: (result: GetResultResponse) => void;
};

export const Form: FC<FormProps> = ({ onSubmit }) => {
  const methods = useForm<FormValues>({
    defaultValues: {
      center: '',
      minLatitude: 0,
      maxLatitude: 0,
      minLongitude: 0,
      maxLongitude: 0,
      geoMagnitude: GeoMagnitude.GEOGRAPHICAL,
      dataTransfer: {
        isNeedToSendRec: false,
        isNeedToSendWmt: false,
      },
    },
    resolver: zodResolver(formSchema),
    shouldFocusError: false,
  });
  const { t } = useTranslation();

  const { callCallback: getResult, isLoading: isResultLoading } = useAsyncCallback(api.getResult, {
    onSuccess: (data) => onSubmit(data),
    onError: () =>
      notification.error({
        title: t('common.error'),
        message: t('form.getResultError'),
      }),
  });

  const { callCallback: downloadResult, isLoading: isResultDownloading } = useAsyncCallback(
    api.downloadResult,
    {
      onSuccess: (data) => downloadFile({ output: 'gecrec.csv', content: data }),
      onError: () =>
        notification.error({
          title: t('common.error'),
          message: t('form.downloadResultError'),
        }),
    },
  );

  const submitHandler =
    (type: 'show' | 'download'): SubmitHandler<FormValues> =>
    (values) => {
      const query: GetResultQuery = {
        center: values.center,
        begin: dayjs(values.dateFrom).format('YYYY-MM-DD'),
        end: dayjs(values.dateTo).format('YYYY-MM-DD'),
        min_lat: values.minLatitude,
        max_lat: values.maxLatitude,
        min_lon: values.minLongitude,
        max_lon: values.maxLongitude,
        geomag: values.geoMagnitude,
        send_rec: values.dataTransfer.isNeedToSendRec,
        send_wmt: values.dataTransfer.isNeedToSendWmt,
      };

      if (type === 'show') {
        getResult(query);
      } else if (type === 'download') {
        downloadResult(query);
      }
    };

  return (
    <FormProvider {...methods}>
      <Box maw={500}>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack>
            <CenterSelect />
            <DateRange />
            <LatitudeFields />
            <LongitudeFields />
            <GeoMagnitudeRadio />
            <NeedToSendFields />
            <Group>
              <Button
                loading={isResultLoading}
                onClick={methods.handleSubmit(submitHandler('show'))}
                style={{
                  flex: 1,
                }}
              >
                {t('form.showResult')}
              </Button>
              <Button
                loading={isResultDownloading}
                onClick={methods.handleSubmit(submitHandler('download'))}
                style={{
                  flex: 1,
                }}
              >
                {t('form.downloadResult')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Box>
    </FormProvider>
  );
};

const CenterSelect: FC = () => {
  const { control } = useFormContext<FormValues>();
  const { t } = useTranslation();

  const { data, callCallback, isLoading } = useAsyncCallback(api.getCenters, {
    onError: () =>
      notification.error({
        title: t('common.error'),
        message: t('form.getCentersError'),
      }),
  });

  useMount(() => {
    callCallback();
  });

  return (
    <Controller
      name="center"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Select
          {...field}
          searchable
          withAsterisk
          label={t('form.center')}
          placeholder={t('form.centerPlaceholder')}
          data={data ?? []}
          error={error?.message && t(error.message)}
          maxDropdownHeight={200}
          nothingFoundMessage={t('common.notFound')}
          rightSection={isLoading ? <Loader size="xs" /> : null}
        />
      )}
    />
  );
};

const DateRange: FC = () => {
  const { control, watch } = useFormContext<FormValues>();
  const { t } = useTranslation();

  const { data, callCallback, isLoading } = useAsyncCallback(api.getCenterAvailability, {
    onError: () =>
      notification.error({
        title: t('common.error'),
        message: t('form.getCenterAvailabilityError'),
      }),
  });

  const center = watch('center');

  useEffect(() => {
    if (center) {
      callCallback({ center });
    }
  }, [callCallback, center]);

  const minDate = data ? new Date(data.begin) : undefined;
  const maxDate = data ? new Date(data.end) : undefined;
  const disabled = isLoading || !center;

  return (
    <Group align="flex-start">
      <Controller
        name="dateFrom"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <CustomDateInput
            {...field}
            withAsterisk
            label={t('form.dateFrom')}
            placeholder={t('common.dd.mm.yyyy')}
            tooltip={t('form.dateTooltip')}
            defaultLevel="decade"
            error={error?.message && t(error.message)}
            disabled={disabled}
            loading={isLoading}
            minDate={minDate}
            maxDate={maxDate}
            styles={{
              root: {
                flex: 1,
              },
              tooltipWrapper: {
                flex: 1,
              },
            }}
          />
        )}
      />
      <Controller
        name="dateTo"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <CustomDateInput
            {...field}
            withAsterisk
            label={t('form.dateTo')}
            placeholder={t('common.dd.mm.yyyy')}
            tooltip={t('form.dateTooltip')}
            defaultLevel="decade"
            error={error?.message && t(error.message)}
            disabled={disabled}
            loading={isLoading}
            minDate={minDate}
            maxDate={maxDate}
            styles={{
              root: {
                flex: 1,
              },
              tooltipWrapper: {
                flex: 1,
              },
            }}
          />
        )}
      />
    </Group>
  );
};

const LatitudeFields: FC = () => {
  const { control } = useFormContext<FormValues>();
  const { t } = useTranslation();

  return (
    <Group align="flex-start">
      <Controller
        name="minLatitude"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Tooltip
            label={`${MIN_LATITUDE} — ${MAX_LATITUDE}`}
            events={{ hover: false, focus: true, touch: false }}
          >
            <NumberInput
              {...field}
              withAsterisk
              label={t('form.minLatitude')}
              placeholder={t('form.minLatitudePlaceholder')}
              error={error?.message && t(error.message)}
              min={MIN_LATITUDE}
              max={MAX_LATITUDE}
              decimalScale={1}
              style={{
                flex: 1,
              }}
            />
          </Tooltip>
        )}
      />
      <Controller
        name="maxLatitude"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Tooltip
            label={`${MIN_LATITUDE} — ${MAX_LATITUDE}`}
            events={{ hover: false, focus: true, touch: false }}
          >
            <NumberInput
              {...field}
              withAsterisk
              label={t('form.maxLatitude')}
              placeholder={t('form.maxLatitudePlaceholder')}
              error={error?.message && t(error.message)}
              min={MIN_LATITUDE}
              max={MAX_LATITUDE}
              decimalScale={1}
              style={{
                flex: 1,
              }}
            />
          </Tooltip>
        )}
      />
    </Group>
  );
};

const LongitudeFields: FC = () => {
  const { control } = useFormContext<FormValues>();
  const { t } = useTranslation();

  return (
    <Group align="flex-start">
      <Controller
        name="minLongitude"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Tooltip
            label={`${MIN_LONGITUDE} — ${MAX_LONGITUDE}`}
            events={{ hover: false, focus: true, touch: false }}
          >
            <NumberInput
              {...field}
              withAsterisk
              label={t('form.minLongitude')}
              placeholder={t('form.minLongitudePlaceholder')}
              error={error?.message && t(error.message)}
              min={MIN_LONGITUDE}
              max={MAX_LONGITUDE}
              decimalScale={1}
              style={{
                flex: 1,
              }}
            />
          </Tooltip>
        )}
      />
      <Controller
        name="maxLongitude"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Tooltip
            label={`${MIN_LONGITUDE} — ${MAX_LONGITUDE}`}
            events={{ hover: false, focus: true, touch: false }}
          >
            <NumberInput
              {...field}
              withAsterisk
              label={t('form.maxLongitude')}
              placeholder={t('form.maxLongitudePlaceholder')}
              error={error?.message && t(error.message)}
              min={MIN_LONGITUDE}
              max={MAX_LONGITUDE}
              decimalScale={1}
              style={{
                flex: 1,
              }}
            />
          </Tooltip>
        )}
      />
    </Group>
  );
};

const GeoMagnitudeRadio: FC = () => {
  const { control } = useFormContext<FormValues>();
  const { t } = useTranslation();

  return (
    <Controller
      name="geoMagnitude"
      control={control}
      render={({ field }) => (
        <Radio.Group {...field} label={t('form.coordinateType')}>
          <Group mt={4}>
            <Radio label={t('form.geographical')} value={GeoMagnitude.GEOGRAPHICAL} />
            <Radio label={t('form.geomagnetic')} value={GeoMagnitude.GEOMAGNETIC} />
          </Group>
        </Radio.Group>
      )}
    />
  );
};

const NeedToSendFields: FC = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>();
  const { t } = useTranslation();

  const errorMessage = errors.dataTransfer?.root?.message;

  return (
    <div>
      <InputLabel mb={4}>{t('form.dataTransfer')}</InputLabel>
      <Stack>
        <Controller
          name="dataTransfer.isNeedToSendRec"
          control={control}
          render={({ field: { value, ...restField } }) => (
            <Checkbox
              {...restField}
              label={t('form.recDataTransfer')}
              checked={value}
              onChange={(e) => restField.onChange(e.currentTarget.checked)}
            />
          )}
        />
        <Controller
          name="dataTransfer.isNeedToSendWmt"
          control={control}
          render={({ field: { value, ...restField } }) => (
            <Checkbox
              {...restField}
              label={t('form.tecDataTransfer')}
              checked={value}
              onChange={(e) => restField.onChange(e.currentTarget.checked)}
            />
          )}
        />
      </Stack>
      {errorMessage && (
        <Text mt={4} size="xs" c="red">
          {t(errorMessage)}
        </Text>
      )}
    </div>
  );
};
