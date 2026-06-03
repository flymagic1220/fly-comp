import globals from 'globals';
import { baseConfig } from './base.js';
import eslintPluginVue from 'eslint-plugin-vue';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';

/**
 * A custom ESLint configuration for libraries that use Vue.
 *
 * @type {import("eslint").Linter.Config[]} */
export const config = [
  ...baseConfig,
  ...defineConfigWithVueTs(eslintPluginVue.configs['flat/recommended'], vueTsConfigs.recommended),
  {
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    rules: {
      'turbo/no-undeclared-env-vars': ['error', { allowList: [] }],
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'any',
            component: 'any',
          },
        },
      ],
      'vue/max-attributes-per-line': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/block-lang': ['error', { script: { lang: ['ts', 'tsx'] } }],
      'vue/valid-v-slot': 'off',
    },
  },
];
