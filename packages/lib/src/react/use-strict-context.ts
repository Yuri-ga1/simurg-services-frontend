import { type Context, useContext } from 'react';
import { assert } from '../typescript';

export const useStrictContext = <TState>(context: Context<TState>): TState => {
  const state = useContext(context);
  assert(state, `could not use ${context.displayName} outside of its provider`);
  return state;
};
