module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-tabs': ['off'],
    'indent': ['error', 'tab'],
    'import/extensions': ['error', 'always'],
    'import/no-default-export': ['error'],
    'import/prefer-default-export': ['off'],
    'arrow-parens': ['error', 'as-needed'],
    'no-unused-vars': ['error', { 'ignoreRestSiblings': true }],
    'arrow-body-style': ['off'],
    'max-classes-per-file': ['off'],
  },
};
