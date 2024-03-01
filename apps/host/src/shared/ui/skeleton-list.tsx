import { Skeleton, type SkeletonProps } from '@mantine/core';
import { type FC } from 'react';

type SkeletonListProps = {
  count: number;
  itemProps: SkeletonProps;
};

export const SkeletonList: FC<SkeletonListProps> = ({ count, itemProps }) =>
  Array(count)
    .fill(0)
    // eslint-disable-next-line react/no-array-index-key
    .map((_, idx) => <Skeleton key={idx} {...itemProps} />);
