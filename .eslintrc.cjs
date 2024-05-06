module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  env: {
    browser: true, // Browser global variables like `window` etc.
    commonjs: true, // CommonJS global variables and CommonJS scoping. Allows require, exports and module.
    es6: true, // Enable all ECMAScript 6 features except for modules.
    jest: true, // Jest global variables like `it` etc.
    node: true, // Defines things like process.env when generating through node
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['import', 'prettier', 'react', 'react-hooks', '@typescript-eslint'],
  rules: {
    // 'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    quotes: ['error', 'single'],
    semi: ['warn', 'always'],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', argsIgnorePattern: '^_', ignoreRestSiblings: true },
    ],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-named-as-default': 'error',
    'import/no-unresolved': 'warn',
    'react/self-closing-comp': 'warn',
    'no-console': ['warn', { allow: ['debug', 'warn', 'error'] }],
    'no-debugger': 'warn',
  },
  settings: {
    'import/ignore': ['node_modules'],
    'import/resolver': {
      alias: {
        map: [
          ['src', './src/'],
          ['public', './public/'],
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
