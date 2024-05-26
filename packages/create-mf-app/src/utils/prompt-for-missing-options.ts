import { existsSync, statSync } from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import { templates, type Options, type RawOptions } from '../types';

const defaultOptions: Partial<Options> = {
  install: true,
  template: 'react-ts',
};

const skipOptions: Omit<Options, 'template' | 'mfName'> = {
  install: true,
};

export const promptForMissingOptions = async (rawOptions: RawOptions): Promise<Options> => {
  let options = { ...rawOptions };
  if (rawOptions.skipPrompts) {
    options = { ...options, ...skipOptions };
  }

  const questions = [];

  if (!options.mfName) {
    questions.push({
      type: 'input',
      name: 'mfName',
      message: 'Please enter the microfrontend name:',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Please enter a microfrontend name.';
        }
        if (input !== defaultOptions.mfName) {
          const targetPath = path.join(process.cwd(), input);
          if (existsSync(targetPath) && statSync(targetPath).isDirectory()) {
            return 'The microfrontend already exists. Please choose another name.';
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
      message: 'Please choose which microfrontend template to use:',
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
    mfName: options.mfName ?? answers.mfName,
    install: options.install || answers.install,
    template: options.template ?? answers.template,
  };
};
