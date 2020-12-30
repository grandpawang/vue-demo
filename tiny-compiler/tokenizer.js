/**
 * transform
 * 源码解析成词素数组
 * (add 2 (subtract 4  2 )) => [ { type: "paren", value: "(" }, ... ]
 */
function tokenizer (input) {
  // 光标
  let current = 0;

  // 词素数组
  const tokens = [];

  while (current < input.length) {
    // 暂存字符
    let char = input[current];

    // 括号
    if (char === '(') {
      tokens.push({
        type: 'paren',
        value: char
      });
      current++;
      continue;
    }

    // 括号
    if (char === ')') {
      tokens.push({
        type: 'paren',
        value: char
      });
      current++;
      continue;
    }

    // 空格
    if (/\s/.test(char)) {
      current++;
      continue;
    }

    // 数字
    if (/[0-9]+/.test(char)) {
      const val = [];

      while (/[0-9]+/.test(char)) {
        val.push(char);
        char = input[++current];
      }

      tokens.push({
        type: 'number',
        value: val.join('')
      });

      continue;
    }

    // 字符串
    if (/['"]/.test(char)) {
      const dot = char;
      const val = [];
      char = input[++current];

      while (char !== dot) {
        val.push(char);
        char = input[++current];
      }

      // 取出反引号
      char = input[++current];

      tokens.push({
        type: 'string',
        value: val.join('')
      });
      continue;
    }

    if (/[a-z]/i.test(char)) {
      const val = [];

      while (/[a-z]/i.test(char)) {
        val.push(char);
        char = input[++current];
      }

      tokens.push({
        type: 'name',
        value: val.join('')
      });

      continue;
    }

    throw new TypeError('dont know what this character is: ' + char);
  }
  return tokens;
}


module.exports = tokenizer
;
