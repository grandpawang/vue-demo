const arr = [12, 34, 51, 42, 77, 45, 22]
const ASC = (a, b) => a - b > 0
const DESC = (a, b) => a - b < 0
// 冒泡

// 每一轮循环将最大的放到末尾
function bubbleSort (arr, fn = (a, b) => (a - b) > 0) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (fn(arr[i], arr[j])) {
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
  }
  return arr
}
console.log(bubbleSort(arr, ASC))
console.log(bubbleSort(arr, DESC))

// 快速function query (n, users, q, ...args) {
  return args.map(([idl, idm, k]) =>
  users.slice(idl - 1, idm).filter(el => el === k).length
)
}

// 插入


