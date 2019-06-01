module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb', 'plugin:jest/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'jest'],
  rules: {
    'implicit-arrow-linebreak': 'off',
    'react/jsx-filename-extension': 'off',
    'linebreak-style': 'off',
    'no-underscore-dangle': [
      'error',
      {
        allow: ['__PRELOADED_STATE__', '__REDUX_DEVTOOLS_EXTENSION__'],
      },
    ],
  },
  overrides: [
    {
      files: ['*.spec.js'],
      rules: {
        'react/prop-types': 'off',
      },
    },
  ],
};
