/* eslint-disable no-extend-native */
Function.prototype._call = function (obj, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  // 运行函数
  obj.exec = this
  const res = obj.exec(...args)
  delete obj.exec
  return res
}

Function.prototype._bind = function (obj, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  // 运行函数
  const _fn = () => {
    obj.exec = this
    const res = obj.exec(...args)
    delete obj.exec
    return res
  }
  return _fn
}

Function.prototype._apply = function (obj, arr) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  // 运行函数
  obj.exec = this
  const res = obj.exec(...arr)
  delete obj.exec
  return res
}


function newObj (name) {
  this.name = name
  this.getName = function (...args) {
    console.log(this.name, ...args)
  }
}



const o1 = new newObj('O1')
const o2 = new newObj('O2')

console.log('this self')
o1.getName()
o2.getName()

console.log('call other')
o1.getName.call(o2, 1, 2, 3)
o1.getName._call(o2, 1, 2, 3)

console.log('bind other')
o1.getName.bind(o2, 1, 2, 3)()
o1.getName._bind(o2, 1, 2, 3)()

console.log('apply other')
o1.getName.apply(o2, [1, 2, 3])
o1.getName._apply(o2, [1, 2, 3])
