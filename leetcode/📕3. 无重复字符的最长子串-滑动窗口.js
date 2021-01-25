/**
 * @param {string} s
 * @return {number}
 * https://leetcode-cn.com/problems/longest-substring-without-repeating-characters/
 */
const lengthOfLongestSubstring = function (s) {
  const arr = [];
  let max = 0
  for (let i = 0; i < s.length; i++) {
    const index = arr.indexOf(s[i])
    if (index !== -1) {
      arr.splice(0, index + 1);
    }
    arr.push(s.charAt(i))
    max = Math.max(arr.length, max)
  }
  return max
};


console.log(lengthOfLongestSubstring('abcabcbb'));
// console.log(lengthOfLongestSubstring('bbbbbb'));
// console.log(lengthOfLongestSubstring('pwwkew'));
// console.log(lengthOfLongestSubstring(''));
// console.log(lengthOfLongestSubstring(' '));
// console.log(lengthOfLongestSubstring('dvdf'));
