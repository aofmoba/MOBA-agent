// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    // Parser that checks the content of the <script> tag
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    'browser': true,
    'node': true,
    'vue/setup-compiler-macros': true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    // Airbnb JavaScript Style Guide https://github.com/airbnb/javascript
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        project: path.resolve(__dirname, './tsconfig.json'),
      },
    },
  },
  rules: {
    'prettier/prettier': 1,
    // Vue: Recommended rules to be closed or modify
    'vue/require-default-prop': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/max-attributes-per-line': 0,
    // Vue: Add extra rules
    'vue/custom-event-name-casing': [2, 'camelCase'],
    'vue/no-v-text': 1,
    'vue/padding-line-between-blocks': 1,
    'vue/require-direct-export': 1,
    'vue/multi-word-component-names': 0,
    // Allow @ts-ignore comment
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-empty-function': 1,
    '@typescript-eslint/no-explicit-any': 0,
    'import/extensions': [
      2,
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-param-reassign': 0,
    'prefer-regex-literals': 0,
    'import/no-extraneous-dependencies': 0,
    //严格的检查缩进问题，不是报错，我们可以关闭这个检查规则,然后在终端输入npm run dev
    'indent': ['off', 2],
    //使用eslint时，严格模式下，报错Missing space before function parentheses的问题，意思是在方法名和刮号之间需要有一格空格。
    'space-before-function-paren': 0,
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    //关闭prettier
    'prettier/prettier': 'off',
  },
};
