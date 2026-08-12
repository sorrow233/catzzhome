import eslint from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['dist/**', 'extension-dist/**', 'legacy_backup/**', 'coverage/**', 'node_modules/**']
  },
  eslint.configs.recommended,
  {
    files: ['src/**/*.js', 'scripts/**/*.js', 'vite.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node }
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  },
  {
    files: ['functions/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { HTMLRewriter: 'readonly', Response: 'readonly', URL: 'readonly' }
    }
  },
  {
    files: ['public/sw.js'],
    languageOptions: {
      globals: { ...globals.serviceworker }
    }
  },
  {
    files: ['**/*.test.js'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  }
];
