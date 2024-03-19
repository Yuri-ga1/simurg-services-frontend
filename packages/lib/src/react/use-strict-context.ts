import { type Context, useContext } from 'react';
import { assert } from '../typescript';

export const useStrictContext = <T>(context: Context<T>): T => {
  const state = useContext(context);
  assert(state, `could not use ${context.displayName} outside of its provider`);
  return state;
};
