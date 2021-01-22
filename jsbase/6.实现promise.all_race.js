function req (params) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(params)
    }, 100);
  })
}

function all (arr) {
  const result = []
  return new Promise((resolve, reject) => {
    let i = 0;
    function next () {
      arr[i].then(res => {
        result.push(res)
        i++
        if (i === arr.length) {
          resolve(result)
        } else {
          next()
        }
      })
    }
    next()
  })
}

function race (arr) {
  return new Promise((resolve, reject) => {
    arr.forEach(mtask => {
      mtask.then(resolve)
    })
  })
}


all([req(1), req(2)]).then(res => console.log(res))
race([req(1), req(2)]).then(res => console.log(res))
