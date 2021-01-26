function add (...args) {
  function _add (..._args) {
    args.push(..._args)
    return _add
  }

  _add.toString = function () {
    return args.reduce((prev, curr) => prev + curr, 0)
  }

  return _add;
}


console.log(add(1)(2)(3).toString())


// 反柯里化通用式应用
// 构造函数 F
function F () {}

// 拼接属性值的方法
F.prototype.concatProps = function () {
  const args = Array.from(arguments);
  return args.reduce((prev, next) => `${this[prev]}&${this[next]}`);
}

// 使用 concatProps 的对象
const obj = {
  name: 'Panda',
  age: 16
};

/**
 *
 * @param {Function} fn
 */
function uncurring (fn) {
  return (...args) => fn.call(...args)
}


// 使用反柯里化进行转化
const concatProps = uncurring(F.prototype.concatProps);

console.log(concatProps(obj, 'name', 'age')) // Panda&16
