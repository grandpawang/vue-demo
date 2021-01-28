/* eslint-disable no-throw-literal */

const __STATE__ = { PENDING: 0, FULFILLED: 1, REJECTED: 2 }

/**
 * 因为promise的状态不可改变，所以每次then后都需要新建一个promise处理then的返回结果
 * 如果是一个promise，就使用当前新建的promise的resolve/reject处理返回的promise
 * 防止其他的promise即调成功又调用失败添加called作为拦截，promise只允许更改一次状态
 * @param {_promise} promise
 * @param {any} x
 * @param {Function} resolve
 * @param {Function} reject
 */
function _resolvePromise (promise, x, resolve, reject) {
  if (promise === x) { // 自己等不到自己
    reject(new TypeError('promise不可回环调用'))
  }
  // 是否已经调用
  let called = false;
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

function resolvePromise (fn, argument, promise, resolve, reject) {
  try {
    const x = fn(argument)
    _resolvePromise(promise, x, resolve, reject)
  } catch (e) {
    reject(e)
  }
}

class _promise {
  constructor (fn) {
    this._state = __STATE__.PENDING
    this._val = undefined
    this._reason = undefined
    this._fulfilled = []
    this._rejected = []
    try {
      fn(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }
  }

  resolve = (val) => {
    if (this._state === __STATE__.PENDING) {
      this._val = val
      this._state = __STATE__.FULFILLED
      this._fulfilled.forEach(f => f())
    }
  }

  reject = (reason) => {
    if (this._state === __STATE__.PENDING) {
      this._reason = reason
      this._state = __STATE__.REJECTED
      this._rejected.forEach(f => f())
    }
  }

  then (onFulfilled, onRejected) {
    const newPromise = new _promise((resolve, reject) => {
      onFulfilled = onFulfilled || (res => res)
      onRejected = onRejected || reject
      if (this._state === __STATE__.PENDING) {
        this._fulfilled.push(() => {
          setTimeout(() => {
            resolvePromise(onFulfilled, this._val, newPromise, resolve, reject)
          })
        })
        this._rejected.push(() => {
          setTimeout(() => {
            resolvePromise(onRejected, this._reason, newPromise, resolve, reject)
          })
        })
      }
      if (this._state === __STATE__.FULFILLED) {
        setTimeout(() => {
          resolvePromise(onFulfilled, this._val, newPromise, resolve, reject)
        })
      }
      if (this._state === __STATE__.REJECTED) {
        setTimeout(() => {
          resolvePromise(onRejected, this._reason, newPromise, resolve, reject)
        })
      }
    })

    return newPromise
  }

  catch (onRejected) {
    const newPromise = new _promise((resolve, reject) => {
      onRejected = onRejected || reject
      if (this._state === __STATE__.PENDING) {
        this._rejected.push(() => {
          setTimeout(() => {
            resolvePromise(onRejected, this._reason, newPromise, resolve, reject)
          })
        })
      }
      if (this._state === __STATE__.REJECTED) {
        setTimeout(() => {
          resolvePromise(onRejected, this._reason, newPromise, resolve, reject)
        })
      }
    })
    return newPromise
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
}).then(res => {
  console.log('then', res)
})
