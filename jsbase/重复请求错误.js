function request () {
  return new Promise((resolve, rejcet) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve(Math.random())
      } else {
        rejcet('error')
      }
    }, Math.random() * 100)
  })
}

function promiseTry (sort, count = 5) {
  return new Promise((resolve, reject) => {
    function attempt () {
      request()
        .then(res => resolve({ res, sort }))
        .catch(err => {
          if (count === 0) {
            resolve(err)
          } else {
            console.log(`No.${sort} try ${count} error ${err}`)
            count--
            attempt()
          }
        })
    }
    attempt()
  })
}

const promises = Array.from(new Array(10), (x, i) => promiseTry(i + 1))

Promise.all(promises).then(res => {
  console.log(res)
})
