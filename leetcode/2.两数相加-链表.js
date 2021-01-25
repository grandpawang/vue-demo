/**
 * Definition for singly-linked list.
 * https://leetcode-cn.com/problems/add-two-numbers/submissions/
 */
function ListNode (val, next) {
  this.val = (val === undefined ? 0 : val)
  this.next = (next === undefined ? null : next)
}

const makeLink = arr => arr.slice(0, -1).reverse().reduce((prev, curr) => {
  return new ListNode(curr, prev)
}, new ListNode(arr[arr.length - 1]))

/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
const addTwoNumbers = function (l1, l2) {
  let addFlag = false
  const res = []
  while (l1 || l2) {
    const v1 = l1?.val || 0
    const v2 = l2?.val || 0
    let _res = v1 + v2 + (+addFlag)
    addFlag = false
    if (_res >= 10) {
      addFlag = true
      _res -= 10
    }
    res.push(_res)
    l1 = l1?.next
    l2 = l2?.next
  }
  if (addFlag) {
    res.push(+addFlag)
  }
  return makeLink(res)
};

console.log(addTwoNumbers(makeLink([9, 9, 9, 9, 9, 9, 9]), makeLink([9, 9, 9, 9])))

