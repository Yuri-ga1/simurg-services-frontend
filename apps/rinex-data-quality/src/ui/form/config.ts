import { isFile } from '@repo/lib/typescript';
import { z } from 'zod';
import type { GraphTS } from '~/api';
import type { TranslateFunction } from '@repo/lib/i18next';

const graphTS: GraphTS[] = [10, 15, 20, 30];

export const getGraphTSData = (t: TranslateFunction): { label: string; value: string }[] =>
  graphTS.map((graph_ts) => ({
    label: t('common.minute', { value: graph_ts }),
    value: `${graph_ts}`,
  }));

export const formSchema = z.object({
  rinexFile: z.any().refine(isFile, 'form.fieldRequired'),
  data_period: z.number({ required_error: 'form.fieldRequired' }),
});

export type FormValues = z.infer<typeof formSchema>;
