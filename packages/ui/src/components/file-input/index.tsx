import {
  FileInput,
  LoadingOverlay,
  Text,
  type FileInputProps,
  InputLabel,
  Tooltip,
} from '@mantine/core';
import { type ReactNode, forwardRef } from 'react';

export type CustomFileInputProps = Omit<FileInputProps, 'classNames' | 'styles'> & {
  tooltip?: ReactNode;
  loading?: boolean;
};

export const CustomFileInput = forwardRef<HTMLButtonElement, CustomFileInputProps>(
  ({ tooltip, disabled, ...restProps }, ref) => {
    if (disabled && tooltip) {
      return (
        <Tooltip label={tooltip} zIndex={999}>
          <span>
            <BaseFileInput ref={ref} disabled={disabled} {...restProps} />
          </span>
        </Tooltip>
      );
    }

    return <BaseFileInput ref={ref} disabled={disabled} {...restProps} />;
  },
);

const BaseFileInput = forwardRef<HTMLButtonElement, CustomFileInputProps>(
  ({ loading, label, error, withAsterisk, id, ...restProps }, ref) => (
    <div>
      {label && (
        <InputLabel htmlFor={id}>
          {label} {withAsterisk && <span style={{ color: 'red' }}>*</span>}
        </InputLabel>
      )}
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} loaderProps={{ size: 'xs' }} />
        <FileInput
          id={id}
          ref={ref}
          fileInputProps={{
            onClick: (event) => {
              // eslint-disable-next-line no-param-reassign
              (event.target as HTMLInputElement).value = '';
            },
          }}
          error={Boolean(error)}
          {...restProps}
        />
      </div>
      {error && (
        <Text mt={4} size="xs" c="red">
          {error}
        </Text>
      )}
    </div>
  ),
);
