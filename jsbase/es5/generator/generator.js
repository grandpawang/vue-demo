function bar () {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random())
    })
  })
}


// function *foo () {
//   try {
//     console.log('start yield');
//     const tmp = yield bar();
//     console.log(tmp);
//   } catch (err) {
//     console.log(err);
//     return false;
//   }
// }


// es5实现
function foo () {
  let state; // 全局状态, 一开始值并不是 1, 因为需要一个 next 函数来启动
  function progress (v) {
    switch (state) {
    case 1:
      console.log('start yield');
      return bar();
    case 2:
      console.log(v);
      // yield 之后没有 return, 默认提供一个 return;
      return;
    case 3:
      // catch 中的逻辑
      console.log(v);
      return false;
    }
  }
  // 生成器返回值
  return {
    next: function (v) {
      if (!state) {
        state = 1;
        return {
          done: false,
          value: progress()
        }
      } else if (state === 1) {
        state = 2;
        return {
          done: true,
          value: progress(v)
        }
      } else {
        return {
          done: true,
          value: undefined
        }
      }
    },
    throw: function (e) {
      if (state === 1) {
        state = 3;
        return {
          done: true,
          value: progress(e)
        }
      } else {
        throw e;
      }
    }
  }
}



const it = foo()
console.log(it.next())
console.log(it.next())
