/**
 * l 为字串长度
 * {
 *  1                                       l === 0
 *  s[i] === s[j]                           l === 1
 *  dp[i+1][j-1] && s[i] === s[j]           l  >  1
 * }
 * @param {string} s
 * @return {string}
 */
const longestPalindrome = function (s) {
  const n = s.length
  const dp = Array(n).fill(0).map(() => Array(n).fill(0))
  let ans = ''
  for (let l = 0; l < n; l++) { // 子串长度
    for (let i = 0; i + l < n; i++) {
      const j = i + l
      if (l === 0) { // 空字符串
        dp[i][j] = true
      } else if (l === 1) { // 一个空位
        dp[i][j] = (s[i] === s[j])
      } else { // n个空位 => s[i] lllll s[j] => s[i] === s[j] 并且 字串(lllll) 是回文
        dp[i][j] = (s[i] === s[j] && dp[i + 1][j - 1])
      }
      if (dp[i][j] && l + 1 > ans.length) {
        ans = s.slice(i, j + 1)
      }
    }
  }
  return ans
};





console.log(longestPalindrome('babad'))
