export const templates = ['react-ts'] as const;

export type Argv = string[];

export type Template = (typeof templates)[number];

export type RawOptions = {
  skipPrompts: boolean;
  install: boolean;
  targetDir?: string;
  template?: Template;
};

export type Options = {
  template: Template;
  targetDir: string;
} & Omit<RawOptions, 'skipPrompts'>;
