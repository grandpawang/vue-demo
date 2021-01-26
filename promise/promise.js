/* eslint-disable no-throw-literal */

const PROMISE_STATE = { PENDING: 0, FULFILLED: 1, REJECTED: 2 }

/**
 * 因为promise的状态不可改变，所以每次then后都需要新建一个promise处理then的返回结果
 * 如果是一个promise，就使用当前新建的promise的resolve/reject处理返回的promise
 * 防止其他的promise即调成功又调用失败添加called作为拦截，promise只允许更改一次状态
 * @param {_promise} promise
 * @param {any} x
 * @param {Function} resolve
 * @param {Function} reject
 */
function resolvePromise (promise, x, resolve, reject) {
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

function _promise (fn) {
  this[Symbol.toStringTag] = '_promise'
  this._status = PROMISE_STATE.PENDING
  this._val = undefined;
  this._reason = undefined;
  this._fulfilled = []
  this._rejected = []

  const resolve = (val) => {
    if (this._status === PROMISE_STATE.PENDING) {
      // 如果resolve一个promise则递归then
      if (Object.prototype.toString.call(val) === '[object _promise]') {
        return val.then(resolve, reject)
      }
      this._status = PROMISE_STATE.FULFILLED
      this._val = val
      this._fulfilled.forEach(f => f())
    }
  }

  const reject = (reason) => {
    if (this._status === PROMISE_STATE.PENDING) {
      this._status = PROMISE_STATE.REJECTED
      this._reason = reason
      this._rejected.forEach(f => f())
    }
  }

  // 初始化执行函数
  try {
    fn(resolve, reject)
  } catch (e) {
    reject(e)
  }

  this.then = function (onFulfilled, onRejected) {
    onFulfilled = onFulfilled || (res => res)
    const __promise__ = new _promise((resolve, reject) => {
      // fulfilled
      if (this._status === PROMISE_STATE.FULFILLED) {
        // 在new之后执行以下代码
        queueMicrotask(() => {
          try {
            const tmp = onFulfilled(this._val)
            resolvePromise(__promise__, tmp, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      // reject
      if (this._status === PROMISE_STATE.REJECTED) {
        queueMicrotask(() => {
          try {
            const tmp = onRejected ? onRejected(this._reason) : reject(this._reason)
            resolvePromise(__promise__, tmp, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      }
      // pending
      if (this._status === PROMISE_STATE.PENDING) {
        this._fulfilled.push(() => {
          queueMicrotask(() => {
            try {
              const tmp = onFulfilled(this._val)
              resolvePromise(__promise__, tmp, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
        this._rejected.push(() => {
          queueMicrotask(() => {
            try {
              const tmp = onRejected ? onRejected(this._reason) : reject(this._reason)
              resolvePromise(__promise__, tmp, resolve, reject)
            } catch (e) {
              reject(e)
            }
          })
        })
      }
    })
    return __promise__
  }

  this.catch = function (onRejected) {
    return new _promise((resolve, reject) => {
      if (this._status === PROMISE_STATE.REJECTED) {
        this._reason = onRejected(this._reason)
      }
      if (this._status === PROMISE_STATE.PENDING) {
        this._rejected.push(() => {
          this._reason = onRejected(this._reason)
        })
      }
    })
  }
}



new _promise((resolve, reject) => {
  setTimeout(() => {
    console.log('1')
    resolve(Math.random() * 15)
  }, 20)
}).then(res => {
  if (res > 10) {
    throw 'try error'
  } else {
    return new _promise((resolve, reject) => {
      setTimeout(() => {
        resolve(100)
      }, 100);
    })
  }
}).then(res => {
  console.log(res)
  return new _promise((resolve, reject) => {
    resolve(new _promise((resolve, reject) => {
      resolve(123)
    }))
  })
}).then().then().then().then(res => {
  console.log(res)
})
