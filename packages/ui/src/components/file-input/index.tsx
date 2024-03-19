import { FileInput, LoadingOverlay, Text, type FileInputProps, InputLabel } from '@mantine/core';
import { forwardRef } from 'react';

export type CustomFileInputProps = Omit<FileInputProps, 'classNames' | 'styles'> & {
  loading?: boolean;
};

export const CustomFileInput = forwardRef<HTMLButtonElement, CustomFileInputProps>(
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
            onClick: (e) => {
              (e.target as HTMLInputElement).value = '';
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
