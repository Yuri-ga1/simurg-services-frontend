import { assert } from '@internal/shared/lib/typescript';
import { type Context, useContext } from 'react';

export const useStrictContext = <T>(context: Context<T>): T => {
  const state = useContext(context);
  assert(state, `Could not use ${context.displayName} outside of its provider`);
  return state;
};
