import { createMfApp } from './create-mf-app';
import { type Argv } from './types';
import { parseArgvIntoOptions } from './utils/parse-argv-into-options';
import { promptForMissingOptions } from './utils/prompt-for-missing-options';

export const cli = async (argv: Argv): Promise<void> => {
  const rawOptions = await parseArgvIntoOptions(argv);
  const options = await promptForMissingOptions(rawOptions);
  await createMfApp(options);
};
