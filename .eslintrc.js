module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true
  },
  extends: 'standard',
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-unused-vars': [2, {
      // 允许声明未使用变量
      vars: 'local',
      // 参数不检查
      args: 'none'
    }],
    // 关闭语句强制分号结尾
    semi: [0],
    // 空行最多不能超过100行
    'no-multiple-empty-lines': [0, { max: 100 }],
    // 关闭禁止混用tab和空格
    'no-mixed-spaces-and-tabs': [0],
    // 数组第一个指定是否启用这个规则，第二个指定几个空格
    indent: [1, 2],
    'new-cap': 'off',
    'promise/param-names': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-new': 'off',
    'no-cond-assign': 'off',
    'no-unused-expressions': 'off'
  }
}
