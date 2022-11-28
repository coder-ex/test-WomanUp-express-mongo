module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'linebreak-style': 'off',                               // Неправильно работает в Windows.
    'arrow-parens': 'off',                                  // Несовместимо с prettier
    'object-curly-newline': 'off',                          // Несовместимо с prettier
    'no-mixed-operators': 'off',                            // Несовместимо с prettier
    'arrow-body-style': 'off',                              // Это - не наш стиль?
    'function-paren-newline': 'off',                        // Несовместимо с prettier
    'no-plusplus': 'off',
    'space-before-function-paren': 0,                       // Несовместимо с prettier
    'max-len': ['error', 100, 2, { ignoreUrls: true, }],    // airbnb позволяет некоторые пограничные случаи
    'no-console': 'error',                                  // airbnb использует предупреждение
    'no-alert': 'error',                                    // airbnb использует предупреждение
    'no-param-reassign': 'off',                             // Это - не наш стиль?
    "radix": "off",                                         // parseInt, parseFloat и radix выключены. Мне это не нравится.
    'react/require-default-props': 'off',                   // airbnb использует уведомление об ошибке
    'react/forbid-prop-types': 'off',                       // airbnb использует уведомление об ошибке
    'react/jsx-filename-extension': ['error', { extensions: ['.js'] }], // airbnb использует .jsx
    'prefer-destructuring': 'off',
    'react/no-find-dom-node': 'off',                        // Я этого не знаю
    'react/no-did-mount-set-state': 'off',
    'react/no-unused-prop-types': 'off',                    // Это всё ещё работает нестабильно
    'react/jsx-one-expression-per-line': 'off',
    "jsx-a11y/anchor-is-valid": ["error", { "components": ["Link"], "specialLink": ["to"] }],
    "jsx-a11y/label-has-for": [2, {
        "required": {
            "every": ["id"]
        }
    }],                                                     // для ошибки вложенных свойств htmlFor элементов label
    'prettier/prettier': ['error'],
  },
  root: true,
  ignorePatterns: ['.eslintrc.js'],

};
