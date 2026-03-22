import { defineConfig } from 'eslint/config';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/eslint-recommended',
    ),

    plugins: {
      '@typescript-eslint': typescriptEslint,
      'unused-imports': unusedImports,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      'import/resolver': {
        typescript: {},

        node: {
          extensions: ['.js', '.ts', '.jsx', '.tsx'],
        },
      },
    },

    rules: {
      quotes: [
        'warn',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],

      semi: 'warn',
      'arrow-parens': 'warn',
      'comma-dangle': 'off',
      'prefer-const': 'warn',
      'spaced-comment': 'warn',
      '@typescript-eslint/ban-ts-comment': 'off',
      camelcase: 'off',
      'no-invalid-this': 'warn',
      'no-unused-expressions': 'warn',
      'space-in-parens': [2, 'never'],
      'array-bracket-spacing': [2, 'never'],
      'computed-property-spacing': [2, 'never'],
      'no-empty-function': 'off',
      'object-curly-spacing': [2, 'always'],
      'no-console': 'off',
      'valid-jsdoc': 'off',
      'guard-for-in': 'off',
      'no-debugger': 'error',
      'one-var': 'off',
      'new-cap': 'off',
      'require-jsdoc': 'off',
      'no-var': 'warn',
      'no-undef-init': 'off',

      'max-len': [
        'warn',
        {
          tabWidth: 2,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          code: 120,
          comments: 120,
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'none',
        },
      ],

      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
    },
  },
]);