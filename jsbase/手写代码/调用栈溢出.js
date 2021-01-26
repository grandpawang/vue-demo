function sum (total, i, cb) {
  if (i === 0) {
    cb(total)
    return
  }
  const block = 1000
  if (i % block === 0) {
    setTimeout(sum, 0, total + 1, i - 1, cb)
  } else {
    sum(total + 1, i - 1, cb)
  }
}

sum(0, 100000, (total) => {
  console.log(total)
})
