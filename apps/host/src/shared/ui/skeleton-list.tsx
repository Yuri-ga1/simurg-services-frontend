import { Group, type MantineSpacing, Skeleton, type SkeletonProps } from '@mantine/core';
import { type FC } from 'react';

type SkeletonListProps = {
  count: number;
  itemProps?: SkeletonProps;
  gap?: MantineSpacing;
};

export const SkeletonList: FC<SkeletonListProps> = ({ count, gap, itemProps }) => (
  <Group gap={gap}>
    {Array(count)
      .fill(0)
      .map((_, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <Skeleton key={idx} {...itemProps} />
      ))}
  </Group>
);
