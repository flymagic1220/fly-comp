import type { Linter } from 'eslint';
import { config as tsConfig } from '@fly/eslint-config/base';

const config: Linter.Config[] = [
  ...tsConfig,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];

export default config;
