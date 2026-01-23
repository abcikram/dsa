function canJump(nums: number[]): boolean {
  // so are doing greddy for max reach
  // [2,3,1,1,4]
  // when index = 0 , maxReach = 0
  let maxReach = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > maxReach) return false;
    maxReach = Math.max(maxReach, i + nums[i]);
  }
  return true;
}


// maxReach means amra kon index porjonto jump korte parbo (maxIndex)

