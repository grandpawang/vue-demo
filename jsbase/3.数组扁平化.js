const arr = [1, [2, [3, [4, [5, [6]]]]]] // => [1, 2, 3, 4, 5, 6]

function normalizateArray (arr) {
  const normalizate = (subArr) => subArr.reduce((prev, curr) => {
    if (curr instanceof Array) {
      prev = prev.concat(normalizate(curr))
    } else {
      prev.push(curr)
    }
    return prev
  }, [])
  return normalizate(arr)
}

const res = normalizateArray(arr)
console.log(res)
