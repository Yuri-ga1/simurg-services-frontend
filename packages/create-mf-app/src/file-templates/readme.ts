type ReadmeTemplateVariables = {
  name: string;
};

export const readmeTemplate = ({ name }: ReadmeTemplateVariables): string => `# ${name}
`;
