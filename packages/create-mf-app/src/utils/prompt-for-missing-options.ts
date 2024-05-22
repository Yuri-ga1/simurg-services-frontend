import { existsSync, statSync } from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { templates, type Options, type RawOptions } from '../types';

const defaultOptions: Options = {
  install: true,
  template: 'react-ts',
  targetDir: '.',
};

const skipOptions: Omit<Options, 'template' | 'targetDir'> = {
  install: true,
};

export const promptForMissingOptions = async (rawOptions: RawOptions): Promise<Options> => {
  let options = { ...rawOptions };
  if (rawOptions.skipPrompts) {
    options = { ...options, ...skipOptions };
  }

  const questions = [];

  if (!options.targetDir) {
    questions.push({
      type: 'input',
      name: 'targetDir',
      message: 'Please enter the directory where you want to create the microfrontend:',
      default: defaultOptions.targetDir,
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Please enter a directory name.';
        }
        if (input !== defaultOptions.targetDir) {
          const targetPath = path.join(process.cwd(), input);
          if (existsSync(targetPath) && statSync(targetPath).isDirectory()) {
            return 'The directory already exists. Please choose another directory name or clear it.';
          }
        }
        return true;
      },
    });
  }

  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which microfrontend template to use',
      choices: templates,
      default: defaultOptions.template,
    });
  }

  if (!options.install) {
    questions.push({
      type: 'confirm',
      name: 'install',
      message: 'Install packages?',
      default: defaultOptions.install,
    });
  }

  const answers = await inquirer.prompt(questions);

  return {
    targetDir: options.targetDir ?? answers.targetDir,
    install: options.install || answers.install,
    template: options.template ?? answers.template,
  };
};
