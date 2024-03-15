import { FileInput, LoadingOverlay, Text, type FileInputProps } from '@mantine/core';
import { forwardRef } from 'react';

export type CustomFileInputProps = Omit<FileInputProps, 'classNames' | 'styles'> & {
  isLoading?: boolean;
};

export const CustomFileInput = forwardRef<HTMLButtonElement, CustomFileInputProps>(
  ({ isLoading, label, error, withAsterisk, ...rest }, ref) => (
    <div>
      {label && (
        <Text fw={500} size="sm">
          {label} {withAsterisk && <span style={{ color: 'red' }}>*</span>}
        </Text>
      )}
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={Boolean(isLoading)} loaderProps={{ size: 'xs' }} />
        <FileInput
          {...rest}
          ref={ref}
          fileInputProps={{
            onClick: (e) => {
              (e.target as HTMLInputElement).value = '';
            },
          }}
          error={Boolean(error)}
        />
      </div>
      {error && (
        <Text size="xs" c="red">
          {error}
        </Text>
      )}
    </div>
  ),
);
