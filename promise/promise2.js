
/* eslint-disable no-throw-literal */
const __STATE__ = { PENDING: 0, FULFILLED: 1, REJECTED: 2 }

function resolvePromise (promise, x, resolve, reject) {
  let called = false;
  if (promise === x) { // 自己等不到自己
    reject(new TypeError('promise不可回环调用'))
  }
  // 是否已经调用
  // promise可以接受对象或者函数
  if ((typeof x === 'object' && x !== null) || (typeof x === 'function')) {
    try {
      const then = promise.then
      if (typeof then === 'function') {
        then.call(x, (y) => {
          if (called) return;
          called = true;
          resolve(y)
        }, (e) => {
          reject(e)
        })
      } else { // 普通对象
        if (called) return;
        called = true;
        resolve(x)
      }
    } catch (e) {
      reject(x)
    }
  } else { // 普通值
    resolve(x)
  }
}

function _promise (fn) {
  let val
  let reason
  let state = __STATE__.PENDING
  const __fulfilled = []
  const __rejected = []
  this[Symbol.toStringTag] = '_promise'

  this.toString = () => {
    return `${val}#${reason}#${state}`
  }


  const resolve = (_val) => {
    if (state === __STATE__.PENDING) {
      if (Object.prototype.toString.call(_val) === '[object _promise]') {
        // 使用这个promise来执行它的then
        _val.then(resolve, reject)
      }
      state = __STATE__.FULFILLED
      val = _val
      __fulfilled.forEach(f => f())
    }
  }

  const reject = (_reason) => {
    if (state === __STATE__.PENDING) {
      if (Object.prototype.toString.call(_reason) === '[object _promise]') {
        // 使用这个promise来执行它的then
        _reason.then(resolve, reject)
      }
      state = __STATE__.REJECTED
      reason = _reason
      __rejected.forEach(f => f())
    }
  }

  /**
   * 创建promise后的回调函数 订阅发布模式
   */
  const runCb = (fn, argument, newPromise, resolve, reject) => {
    // 传入的newPromise没有初始化完
    queueMicrotask(() => {
      try {
        const x = fn(argument)
        resolvePromise(newPromise, x, resolve, reject)
      } catch (e) {
        reject(e)
      }
    })
  }


  this.then = (onFulfill, onReject) => {
    const newPromise = new _promise((resolve, reject) => {
      onFulfill = onFulfill || ((res) => res)
      onReject = onReject || reject
      if (state === __STATE__.FULFILLED) {
        runCb(onFulfill, val, newPromise, resolve, reject)
      }
      if (state === __STATE__.REJECTED) {
        runCb(onReject, reason, newPromise, resolve, reject)
      }
      if (state === __STATE__.PENDING) {
        __fulfilled.push(() => {
          runCb(onFulfill, val, newPromise, resolve, reject)
        })
        __rejected.push(() => {
          runCb(onReject, reason, newPromise, resolve, reject)
        })
      }
    })
    return newPromise
  }

  this.catch = (onReject) => {
    const newPromise = new _promise((resolve, reject) => {
      onReject = onReject || reject
      if (state === __STATE__.REJECTED) {
        runCb(onReject, reason, newPromise, resolve, reject)
      }
      if (state === __STATE__.PENDING) {
        __rejected.push(() => {
          runCb(onReject, reason, newPromise, resolve, reject)
        })
      }
    })
    return newPromise
  }

  try {
    fn(resolve, reject)
  } catch (e) {
    reject(e)
  }
}


new _promise((resolve, reject) => {
  setTimeout(() => {
    console.log('1')
    resolve(Math.random() * 100)
  }, 20)
}).then(res => {
  console.log(res)
  if (res > 10) {
    throw 'try error'
  } else {
    return new _promise((resolve, reject) => {
      setTimeout(() => {
        resolve(100)
      }, 100);
    })
  }
}, err => {
  console.log('onReject', err)
}).then(res => {
  console.log(res)
  return new _promise((resolve, reject) => {
    resolve(new _promise((resolve, reject) => {
      resolve(123)
    }))
  })
}).then().then().then().then(res => {
  console.log(res)
}).catch(e => {
  console.log('catch and new one next', e)
  return new _promise((resolve, reject) => {
    resolve(e)
  })
}).then(res => {
  console.log(res)
})


