const tokenizer = require('./tokenizer');
const parser = require('./parse');
const transform = require('./transform')
const codegen = require('./codegen')

const inputCode = '( add 2 ( subtract 4  2 ) )'
console.log(inputCode)

// 源码 -> 词素
const tokens = tokenizer(inputCode);
// console.log(tokens);

// 词素 -> ast
const ast = parser(tokens);
// console.log(require("util").inspect(ast, false, null, true));

// ast -> newAST
const newAst = transform(ast)
// console.log(require("util").inspect(newAst, false, null, true));

// newAST -> code
const code = codegen(newAst)
console.log(code)
