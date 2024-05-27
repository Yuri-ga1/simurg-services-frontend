import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import { Listr } from 'listr2';
import { packageJsonTemplate } from './file-templates/package-json';
import { readmeTemplate } from './file-templates/readme';
import { type Options } from './types';
import { copyTemplateFiles } from './utils/copy-template-files';
import { createFileByTemplate } from './utils/create-file-by-template';
import { installDeps } from './utils/install-deps';

export const createMfApp = async (options: Options): Promise<void> => {
  const targetDir = options.mfName;
  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    decodeURI(fileURLToPath(currentFileUrl)),
    '../../templates',
    options.template.toLowerCase(),
  );

  const tasks = new Listr(
    [
      {
        title: 'Copy template files',
        task: async () => copyTemplateFiles(templateDir, targetDir),
      },
      {
        title: 'Create other config files',
        task: async () =>
          Promise.all([
            createFileByTemplate(packageJsonTemplate, {
              variables: {
                name: options.mfName,
              },
              targetDir,
              filename: 'package.json',
            }),
            createFileByTemplate(readmeTemplate, {
              variables: {
                name: options.mfName,
              },
              targetDir,
              filename: 'README.md',
            }),
          ]),
      },
      {
        title: 'Install dependencies',
        task: async () => installDeps(targetDir),
        skip: options.install
          ? false
          : 'Pass --install or -i to automatically install dependencies',
      },
    ],
    { concurrent: false, exitOnError: true },
  );

  try {
    await tasks.run();
    console.log(`${chalk.green.bold('DONE')} Microfrontend is ready`);
  } catch (error) {
    console.error(error);
  }
};
