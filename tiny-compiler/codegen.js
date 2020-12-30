/**
 * 代码生成器
 */
function codeGenerator (node) {
  // 根据节点类型分情况处理。
  switch (node.type) {
  // 如果有一个`Program`节点。会使用代码生成器遍历`body`属性中的所有节点然后使用
  // 换行符\n连接起来。
  case 'Program':
    return node.body.map(codeGenerator).join('\n');

    // 针对`ExpressionStatement`会对节点的expression属性调用代码生成器，并加上一个分号……
  case 'ExpressionStatement':
    return (
      codeGenerator(node.expression) + ';' // << (...because we like to code the *correct* way)
    );

    // 针对`CallExpression`会打印出`callee`，也就是函数名，加上一个开括号，会对
    // `arguments`数组中的每一个节点调用代码生成器，使用逗号连接它们，然后添加一个闭括号。
  case 'CallExpression':
    return (
      codeGenerator(node.callee) + // 生成函数名
        '(' +
        node.arguments.map(codeGenerator).join(', ') + // 生成参数
        ')'
    );

    // 针对`Identifier`，简单地返回节点的name属性。
  case 'Identifier':
    return node.name;

    // 针对`NumberLiteral`，简单地返回节点的值。
  case 'NumberLiteral':
    return node.value;

    // 针对StringLiteral`，在节点value周围加上引号。
  case 'StringLiteral':
    return '"' + node.value + '"';

    // 如果没有匹配，抛出一个错误。
  default:
    throw new TypeError(node.type);
  }
}

module.exports = codeGenerator
