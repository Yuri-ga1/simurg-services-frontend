type PackageJsonTemplateVariables = {
  name: string;
};

export const packageJsonTemplate = ({ name }: PackageJsonTemplateVariables): string => `{
  "name": "${name}",
  "private": true,
  "scripts": {
    "start": "mf-scripts start",
    "build": "mf-scripts build",
    "analyze": "mf-scripts analyze",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "npm run lint -- --fix"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@mantine/core": "^7.6.1",
    "@mantine/hooks": "^7.6.1",
    "@repo/lib": "workspace:^",
    "@repo/ui": "workspace:^",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.51.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@repo/eslint-config": "workspace:^",
    "@repo/mf-scripts": "workspace:^",
    "@repo/tsconfig": "workspace:^",
    "@repo/types": "workspace:^",
    "@types/node": "^20.11.24",
    "@types/react": "^18.2.63",
    "@types/react-dom": "^18.2.19",
    "babel-loader": "^9.1.3",
    "css-loader": "^6.10.0",
    "eslint": "^8.57.0",
    "postcss-loader": "^8.1.1",
    "style-loader": "^3.3.4",
    "typescript": "^5.3.3"
  }
}`;
