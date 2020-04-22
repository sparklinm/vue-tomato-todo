module.exports = {
  'root': true,
  'env': {
    'browser': true,
    'node': true,
    'es6': true
  },
  'parserOptions': {
    'parser': 'babel-eslint',
    'ecmaVersion': 2017,
    'sourceType': 'module'
  },
  'extends': ['plugin:vue/recommended', 'eslint:recommended'],
  'plugins': ['vue'],
  'rules': {
    'indent': [
      'error',
      2,
      {
        'SwitchCase': 1,
        'MemberExpression': 1,
        'ArrayExpression': 1,
        'FunctionDeclaration': {
          'parameters': 'first'
        },
        'CallExpression': {
          'arguments': 1
        },
        'ImportDeclaration': 'first',
        'ObjectExpression': 1
      }
    ],
    'no-sequences': 'error',
    'linebreak-style': 'off',
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'semi-style': ['error', 'last'],
    'semi-spacing': [
      'error',
      {
        'before': false,
        'after': true
      }
    ],
    'camelcase': 'off',
    'default-case': 'error',
    'no-new-func': 'error',
    'no-void': 'error',
    'array-bracket-spacing': ['error', 'never'],
    'no-tabs': 'error',
    'no-var': 'error',
    'one-var': ['error', 'never'],
    'prefer-const': [
      'error',
      {
        'destructuring': 'all'
      }
    ],
    'no-trailing-spaces': 'error',
    'operator-assignment': ['error', 'always'],
    'dot-location': ['error', 'property'],
    'no-alert': 'error',
    'no-else-return': [
      'error',
      {
        allowElseIf: false
      }
    ],
    'no-case-declarations': 'off',
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error', 'trace']
      }
    ],
    'no-unused-vars': 'error',
    'no-multi-spaces': 'error',
    'valid-jsdoc': 'warn',
    'eqeqeq': 'error',
    'guard-for-in': 'warn',
    'no-multi-str': 'error',
    'no-return-await': 'error',
    'no-return-assign': 'error',
    'no-throw-literal': 'error',
    'no-undef-init': 'error',
    'no-use-before-define': 'warn',
    'key-spacing': [
      'error',
      {
        'beforeColon': false,
        'afterColon': true,
        'mode': 'strict'
      }
    ],
    'keyword-spacing': [
      'error',
      {
        'before': true,
        'after': true
      }
    ],
    'space-before-blocks': [
      'error',
      {
        'functions': 'always',
        'keywords': 'always',
        'classes': 'always'
      }
    ],
    'spaced-comment': ['error', 'always'],
    'space-infix-ops': 'error',
    'arrow-spacing': [
      'error',
      {
        'before': true,
        'after': true
      }
    ],
    'no-useless-constructor': 'warn',
    'comma-dangle': ['error', 'never'],
    'comma-spacing': [
      'error',
      {
        'before': false,
        'after': true
      }
    ],
    'space-before-function-paren': ['error', 'always'],
    'no-param-reassign': 'warn',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-newline': [
      'error',
      {
        'multiline': true,
      }
    ],
    // 'array-element-newline': [
    //   'error',
    //   {
    //     'multiline': true,
    //   }
    // ],
    'object-property-newline': [
      'error',
      {
        'allowAllPropertiesOnSameLine': false
      }
    ],
    'object-curly-newline': [
      'error',
      {
        'ObjectExpression': {
          'multiline': true,
          'minProperties': 1
        },
        'ObjectPattern': {
          'multiline': true
        },
        'ImportDeclaration': 'never',
        'ExportDeclaration': {
          'multiline': true,
          'minProperties': 3
        }
      }
    ],
    'space-in-parens': ['error', 'never'],
    'padding-line-between-statements': [
      'error',
      { 'blankLine': 'always', 'next': '*', 'prev': ['const', 'let', 'var'] },
      { 'blankLine': 'any', 'next': ['const', 'let', 'var'], 'prev': ['const', 'let', 'var'] },
      { 'blankLine': 'always', 'next': 'export', 'prev': '*' }
    ],
  },
  'plugins': ['html'],
  'settings': {
    'html/indent': '+2',
    'html/report-bad-indent': 'error'
  },
  'globals': {
    '$': true,
    'log': true,
    'utils': true,
    'models': true,
    'views': true,
    'pages': true,
    'validators': true,
    'Constants': true,
    'Vue': true,
    '_': true,
    'sprintf': true,
    'moment': true,
    'JSONRpc': true,
    'Chart': true,
    'accounting': true,
    'LIOUtil': true,
    'module': true,
    'Velocity': true,
    'html2canvas': true,
    'StackBlur': true,
    'gsap': true,
    'TWEEN': true
  }
}
