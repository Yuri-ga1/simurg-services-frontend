import { Button, Tooltip, type ButtonProps } from '@mantine/core';
import { type HTMLAttributes, type FC, type CSSProperties, type ReactNode } from 'react';

export type CustomButtonProps = Omit<HTMLAttributes<HTMLButtonElement>, 'color'> &
  Omit<ButtonProps, 'styles'> & {
    tooltip?: ReactNode;
    styles?: {
      root?: CSSProperties;
      tooltipWrapper?: CSSProperties;
    };
  };

export const CustomButton: FC<CustomButtonProps> = ({
  disabled,
  tooltip,
  styles,
  style,
  ...restProps
}) => {
  const buttonStyle = { ...style, ...styles?.root };

  if (disabled && tooltip) {
    return (
      <Tooltip label={tooltip}>
        <span style={{ display: 'block', ...styles?.tooltipWrapper }}>
          <Button disabled={disabled} style={buttonStyle} {...restProps} />
        </span>
      </Tooltip>
    );
  }

  return <Button disabled={disabled} style={buttonStyle} {...restProps} />;
};
