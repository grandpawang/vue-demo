/**
 * parse
 * 词素数组解析成ast
 * [{ type: 'paren', value: '(' }, ...] => { type: 'Program', body: [...] }
 */
function parser (tokens) {
  let current = 0;

  // 递归解析词素数组
  // 为了解析函数递归调用
  function walk () {
    let token = tokens[current];

    // number
    if (token.type === 'number') {
      current++;
      return {
        type: 'NumberLiteral',
        value: token.value
      };
    }

    // string
    if (token.type === 'string') {
      current++;

      return {
        type: 'StringLiteral',
        value: token.value
      };
    }

    // function
    if (token.type === 'paren' && token.value === '(') {
      token = tokens[++current];
      const node = {
        type: 'CallExpression',
        name: token.value,
        params: []
      };

      token = tokens[++current];

      while (
        token.type !== 'paren' ||
                (token.type === 'paren' && token.value !== ')')
      ) {
        // 推入参数
        node.params.push(walk());
        token = tokens[current];
      }
      ++current;
      return node;
    }

    throw new TypeError(token.type);
  }

  const ast = {
    type: 'Program',
    body: []
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}

module.exports = parser
;
