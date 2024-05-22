import { execa } from 'execa';

export const installDeps = async (targetDir: string): Promise<void> => {
  try {
    await execa('pnpm', ['install'], { cwd: targetDir });
  } catch {
    throw new Error(`Failed to install dependencies`);
  }
};
