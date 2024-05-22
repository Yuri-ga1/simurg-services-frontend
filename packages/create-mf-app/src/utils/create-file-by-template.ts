import { writeFile } from 'fs/promises';

type GetTemplateCallback<T> = (args: T) => string;

type CreateFileByTemplateOptions<T> = { variables: T; targetDir: string; filename: string };

export const createFileByTemplate = async <T>(
  getTemplate: GetTemplateCallback<T>,
  options: CreateFileByTemplateOptions<T>,
): Promise<void> => {
  try {
    const template = getTemplate(options.variables);
    await writeFile(`${options.targetDir}/${options.filename}`, template);
  } catch {
    throw new Error(`Failed to create ${options.filename}`);
  }
};
