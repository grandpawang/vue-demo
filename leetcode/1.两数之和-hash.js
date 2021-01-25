/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 * https://leetcode-cn.com/problems/two-sum/
 */
const twoSum = function (nums, target) {
  const _cache = {}
  nums.forEach((num, idx) => {
    _cache[num] = idx
  })

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i]
    if (_cache[target - num] && i !== _cache[target - num]) {
      return [i, _cache[target - num]]
    }
  }
};


console.log(twoSum([2, 2, 3, 3], 6))
