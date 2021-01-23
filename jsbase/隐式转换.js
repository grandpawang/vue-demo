/* eslint-disable no-var */

// var a = ???
// if (a == 1 && a == 2 && a == 3) {
//   console.log(1)
// }
// 隐式装换 如果复杂类型， 隐式的调用对象.valueOf


// 1
var a = {
  i: 0,
  valueOf: function () {
    return ++a.i;
  }
}
if (a == 1 && a == 2 && a == 3) {
  console.log('1 success')
}

// 2 xxxxxxxxxxxxxxxxxx

// var o = Object.defineProperty({ i: -1 }, 'test', {
//   get () {
//     return ++this.i
//   }
// })
// // console.log(o.test)
// var a = o.test
// console.log(a)
// console.log(a)
// console.log(o.test)
// console.log(o.test)
// if (a == 1 && a == 2 && a == 3) {
//   console.log('2 success')
// }

// 3
var a = [1, 2, 3]
a.join = a.shift

// 原理 [1]隐式调用join
// console.log([1] == 1)
// console.log(a.join())
// console.log(a.join())
// console.log(a.join())

if (a == 1 && a == 2 && a == 3) {
  console.log('3 success')
}


