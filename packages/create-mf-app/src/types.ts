export const templates = ['react-ts'] as const;

export type Argv = string[];

export type Template = (typeof templates)[number];

export type RawOptions = {
  skipPrompts: boolean;
  install: boolean;
  mfName?: string;
  template?: Template;
};

export type Options = Required<Omit<RawOptions, 'skipPrompts'>>;
