function get () {
  const g = {
    done: false,
    count: 0,
    next () {
      if (this.count === 3) this.done = true;
      if (this.done) return { value: this.count, done: this.done };
      this.count++;
      return { value: this.count, done: this.done };
    }
  }
  return g;
}

function _await () {
  this.c = function (data) {
    if (!this.isCalledByAsync) {
      throw new Error('Should be called by async');
    }
    let result = data.next()
    while (!result.done) { // 阻塞执行
      console.log('awaiting...', result);
      result = data.next();
    }
    return result.value;
  }
}

function _async (fn) {
  _await.prototype.isCalledByAsync = true;
  const m = get();
  console.log('async before');
  const d = new _await().c(m);
  console.log('async after');
  console.log(d);
  _await.prototype.isCalledByAsync = false;
}

_async(() => {
  const g = get();
  console.log('no async before');
  const a = new _await().c(g);
  console.log(a);
  console.log('no async after');
})

