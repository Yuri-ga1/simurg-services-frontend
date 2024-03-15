import { Button, Tooltip, type ButtonProps } from '@mantine/core';
import { type HTMLAttributes, type FC } from 'react';

export type CustomButtonProps = Omit<HTMLAttributes<HTMLButtonElement>, 'color'> &
  ButtonProps & {
    tooltip?: string;
  };

export const CustomButton: FC<CustomButtonProps> = ({ disabled, tooltip, ...rest }) => {
  if (disabled && tooltip) {
    return (
      <Tooltip label={tooltip}>
        <span>
          <Button disabled={disabled} {...rest} />
        </span>
      </Tooltip>
    );
  }

  return <Button disabled={disabled} {...rest} />;
};