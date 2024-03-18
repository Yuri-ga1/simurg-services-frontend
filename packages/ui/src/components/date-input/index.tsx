import { Loader, Tooltip, type TooltipProps } from '@mantine/core';
import { type DateInputProps, DateInput } from '@mantine/dates';
import { type FC } from 'react';
import styles from './styles.module.css';

export type CustomDateInputProps = DateInputProps & {
  tooltip?: string;
  tooltipPosition?: TooltipProps['position'];
  isLoading?: boolean;
};

export const CustomDateInput: FC<CustomDateInputProps> = ({
  disabled,
  tooltip,
  tooltipPosition,
  isLoading,
  rightSection,
  ...restProps
}) => {
  if (disabled && tooltip) {
    return (
      <Tooltip label={tooltip} position={tooltipPosition}>
        <span style={{ position: 'relative' }}>
          <DateInput disabled={disabled} {...restProps} />
          {isLoading && (
            <div className={styles.loaderWrapper}>
              <Loader size="xs" />
            </div>
          )}
        </span>
      </Tooltip>
    );
  }

  return (
    <DateInput
      disabled={disabled}
      rightSection={isLoading ? <Loader size="xs" /> : rightSection}
      {...restProps}
    />
  );
};
