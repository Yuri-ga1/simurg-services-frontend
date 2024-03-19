import { Loader, type MantineStyleProp, Tooltip, type TooltipProps } from '@mantine/core';
import { type DateInputProps, DateInput } from '@mantine/dates';
import { type CSSProperties, forwardRef } from 'react';
import classes from './styles.module.css';

export type CustomDateInputProps = Omit<DateInputProps, 'styles'> & {
  tooltip?: string;
  tooltipPosition?: TooltipProps['position'];
  loading?: boolean;
  styles?: {
    root?: CSSProperties;
    tooltipWrapper?: CSSProperties;
  };
};

export const CustomDateInput = forwardRef<HTMLInputElement, CustomDateInputProps>(
  (
    { disabled, tooltip, tooltipPosition, loading, rightSection, styles, style, ...restProps },
    ref,
  ) => {
    const dateInputStyle = { ...style, ...styles?.root } as MantineStyleProp;

    if (disabled && tooltip) {
      return (
        <Tooltip label={tooltip} position={tooltipPosition}>
          <span style={{ position: 'relative', display: 'block', ...styles?.tooltipWrapper }}>
            <DateInput ref={ref} disabled={disabled} style={dateInputStyle} {...restProps} />
            {loading && (
              <div className={classes.loaderWrapper}>
                <Loader size="xs" />
              </div>
            )}
          </span>
        </Tooltip>
      );
    }

    return (
      <DateInput
        ref={ref}
        disabled={disabled}
        rightSection={loading ? <Loader size="xs" /> : rightSection}
        style={dateInputStyle}
        {...restProps}
      />
    );
  },
);
