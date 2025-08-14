import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import eslintPluginAstro from 'eslint-plugin-astro'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/public',
      '**/dist',
      '**/dist/*',
      '**/tests/*',
      'coverage',
      '.astro/*',
      'node_modules/*',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.{tsx,jsx,mjs,cjs,js,ts,astro}'],
    languageOptions: { ecmaVersion: 'latest', globals: globals.browser },
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/type-annotation-spacing': 'error',
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'never'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'import/order': [
        'warn',
        {
          alphabetize: { caseInsensitive: true, order: 'asc' },
          groups: ['builtin', 'external', 'sibling', 'parent'],
          'newlines-between': 'always',
          pathGroupsExcludedImportTypes: ['builtin'],
          pathGroups: [
            {
              group: 'external',
              pattern: '@/**',
              position: 'after',
            },
          ],
        },
      ],
      'astro/semi': ['error', 'never'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      'max-len': ['error', { code: 136 }],
    },
  },
)
