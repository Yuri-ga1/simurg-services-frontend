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

enum GeoMagnitude {
  GEOGRAPHICAL = 'false',
  GEOMAGNETIC = 'true',
}

const formSchema = z.object({
  center: z.string().min(1, { message: 'Обязательно к заполнению' }),
  dateFrom: z.date({ required_error: 'Обязательно к заполнению' }),
  dateTo: z.date({ required_error: 'Обязательно к заполнению' }),
  minLatitude: z.number({ invalid_type_error: 'Обязательно к заполнению' }),
  maxLatitude: z.number({ invalid_type_error: 'Обязательно к заполнению' }),
  minLongitude: z.number({ invalid_type_error: 'Обязательно к заполнению' }),
  maxLongitude: z.number({ invalid_type_error: 'Обязательно к заполнению' }),
  geoMagnitude: z.string(),
  isNeedToSendRec: z.boolean(),
  isNeedToSendWmt: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

type FormProps = {
  onResultGet: (result: GetResultResponse) => void;
};

export const Form: FC<FormProps> = ({ onResultGet }) => {
  const methods = useForm<FormValues>({
    defaultValues: {
      center: '',
      minLatitude: 0,
      maxLatitude: 0,
      minLongitude: 0,
      maxLongitude: 0,
      geoMagnitude: GeoMagnitude.GEOGRAPHICAL,
      isNeedToSendRec: false,
      isNeedToSendWmt: false,
    },
    resolver: zodResolver(formSchema),
    shouldFocusError: false,
  });

  const { callCallback: getResult, isLoading: isResultLoading } = useAsyncCallback(api.getResult, {
    onSuccess: (data) => onResultGet(data),
    onError: () =>
      notification.error({
        title: 'Ошибка!',
        message: 'Произошла ошибка при получении результата',
      }),
  });

  const { callCallback: downloadResult, isLoading: isResultDownloading } = useAsyncCallback(
    api.downloadResult,
    {
      onSuccess: (data) => downloadFile({ output: 'gecrec.csv', content: data }),
      onError: () =>
        notification.error({
          title: 'Ошибка!',
          message: 'Произошла ошибка при скачивании результата',
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
        send_rec: values.isNeedToSendRec,
        send_wmt: values.isNeedToSendWmt,
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
                Отобразить результат
              </Button>
              <Button
                loading={isResultDownloading}
                onClick={methods.handleSubmit(submitHandler('download'))}
                style={{
                  flex: 1,
                }}
              >
                Скачать результат
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
  const { data, callCallback, isLoading } = useAsyncCallback(api.getCenters, {
    onError: () =>
      notification.error({
        title: 'Ошибка!',
        message: 'Произошла ошибка при загрузке центров',
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
          label="Ионосферный центр"
          placeholder="Выберите ионосферный центр"
          data={data ?? []}
          error={error?.message}
          maxDropdownHeight={200}
          nothingFoundMessage="Ничего не найдено"
          rightSection={isLoading ? <Loader size="xs" /> : null}
        />
      )}
    />
  );
};

const DateRange: FC = () => {
  const { control, watch } = useFormContext<FormValues>();

  const { data, callCallback, isLoading } = useAsyncCallback(api.getCenterAvailability, {
    onError: () =>
      notification.error({
        title: 'Ошибка!',
        message: 'Произшола ошибка при получении свободных дат центра',
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
            label="Дата начала"
            placeholder="дд.мм.гггг"
            tooltip="Сперва нужно выбрать ионосферный центр"
            defaultLevel="decade"
            error={error?.message}
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
            label="Дата конца"
            placeholder="дд.мм.гггг"
            tooltip="Сперва нужно выбрать ионосферный центр"
            defaultLevel="decade"
            error={error?.message}
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
              label="Мин. широта"
              placeholder="Введите мин. широту"
              error={error?.message}
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
              label="Макс. широта"
              placeholder="Введите макс. широту"
              error={error?.message}
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
              label="Мин. долгота"
              placeholder="Введите мин. долготу"
              error={error?.message}
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
              label="Макс. долгота"
              placeholder="Введите макс. долготу"
              error={error?.message}
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

  return (
    <Controller
      name="geoMagnitude"
      control={control}
      render={({ field }) => (
        <Radio.Group {...field} label="Тип координат">
          <Group mt={4}>
            <Radio label="Географические" value={GeoMagnitude.GEOGRAPHICAL} />
            <Radio label="Геомагнитные" value={GeoMagnitude.GEOMAGNETIC} />
          </Group>
        </Radio.Group>
      )}
    />
  );
};

const NeedToSendFields: FC = () => {
  const {
    control,
    watch,
    formState: { isSubmitted },
  } = useFormContext<FormValues>();

  const isNeedToSendRec = watch('isNeedToSendRec');
  const isNeedToSendWmt = watch('isNeedToSendWmt');

  return (
    <div>
      <InputLabel mb={4}>Передеча данных</InputLabel>
      <Stack>
        <Controller
          name="isNeedToSendRec"
          control={control}
          render={({ field: { value, ...restField } }) => (
            <Checkbox
              {...restField}
              label="Передача данных REC в GECu"
              checked={value}
              onChange={(e) => restField.onChange(e.currentTarget.checked)}
            />
          )}
        />
        <Controller
          name="isNeedToSendWmt"
          control={control}
          render={({ field: { value, ...restField } }) => (
            <Checkbox
              {...restField}
              label="Передача средневзвешенных данных TEC в TECu"
              checked={value}
              onChange={(e) => restField.onChange(e.currentTarget.checked)}
            />
          )}
        />
      </Stack>
      {isSubmitted && !isNeedToSendRec && !isNeedToSendWmt && (
        <Text mt={4} size="xs" c="red">
          Обязательно выбрать хотя бы одну опцию
        </Text>
      )}
    </div>
  );
};
