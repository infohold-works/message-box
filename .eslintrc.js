module.exports = {
  root: true,
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    'arrow-parens': 0,
    'camelcase': 0,
    'eqeqeq': 0,
    'handle-callback-err': 0,
    'new-cap': 0,
    'no-extra-boolean-cast': 0,
    'no-floating-decimal': 0,
    'no-new': 0,
    'no-throw-literal': 0,
    'no-unused-vars': 1,
    'no-useless-call': 0,
    'one-var': 0,
    'operator-linebreak': 0,
    'quotes': 0,
    'semi': 0,
    'space-before-function-paren': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  'env': {
    'browser': true,
    'node': true
  }
}
