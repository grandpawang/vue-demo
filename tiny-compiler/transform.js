

/**
 * 有了抽象语法树，希望可以使用一个访问者对象来访问各个节点。
 * 目的是能够在碰到一个节点的时候调用访问者对象相应的方法。
 * @param ast 语法树
 * @param visitor 访问者对象
 */
function traverser (ast, visitor) {
  // `traverseArray`函数，这个函数允许遍历一个数组并且调用接下来定义的函数："traverseNode`。
  function traverseArray (array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }

  function traverseNode (node, parent) {
    const methods = visitor[node.type]

    // 如果当前类型节点有相匹配的`enter`方法，调用这个方法`enter`方法并传入节点以及父节点。
    if (methods && methods.enter) {
      methods.enter(node, parent)
    }

    switch (node.type) {
    // 由于Program节点的body属性是一个节点数组，`traverseArray`函数来向下遍历它们。
    case 'Program':
      traverseArray(node.body, node);
      break;

      // 对于`CallExpression`节点，遍历它的`params`属性。
    case 'CallExpression':
      traverseArray(node.params, node);
      break;

      // 对于`NumberLiteral`和`StringLiteral`的情况，并没有任何子节点去访问，所以直接break。
    case 'NumberLiteral':
    case 'StringLiteral':
      break;

    default:
      throw new TypeError(node.type);
    }

    // 如果访问者对象针对当前类型节点存在着一个`exit`方法的话，在这里调用它并传入节点和父节点。
    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }

  // ast 语法树没有根节点
  traverseNode(ast, null);
}


/**
 * transform
 * 转换器
 * 接收创造的抽象语法树并将它和一个访问者对象传给traverser函数
 */
function transformer (ast) {
  const newAst = {
    type: 'Program',
    body: []
  };

  // _context 为新语法树的引用
  ast._context = newAst.body;

  traverser(ast, {

    NumberLiteral: {
      enter (node, parent) {
        parent._context.push({
          type: 'NumberLiteral',
          value: node.value
        });
      }
    },


    StringLiteral: {
      enter (node, parent) {
        parent._context.push({
          type: 'StringLiteral',
          value: node.value
        });
      }
    },

    CallExpression: {

      enter (node, parent) {
        // 创建一个新的`CallExpression`类型节点，这个新节点还有一个嵌套的`Identifier`对象。
        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name
          },
          arguments: []
        };

        // 接下来给原始的`CallExpression`节点定义一个`context`属性。这个属性指向
        // `expression`的arguments属性，这样就可以添加参数了。
        node._context = expression.arguments;

        // 接下来检测父节点是否是一个`CallExpression`，如果不是的话……
        if (parent.type !== 'CallExpression') {
          // 将的`CallExpression`节点包裹在`ExpressionStatement`节点中。
          // 这样做的原因是因为JS中顶层的`CallExpression`实际上是语句。
          expression = {
            type: 'ExpressionStatement',
            expression: expression
          };
        }

        // 最后，将的`CallExpression`（可能被包裹）添加到父节点的`context`属性。
        parent._context.push(expression);
      }
    }

  })

  return newAst
}

module.exports = transformer
