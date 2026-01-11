function findPeakElement(nums: number[]): number {
  let n = nums.length;

  if (n == 0) return -1;
  if (n == 1) return 0;

  let low = 0;
  let high = n - 1;

  let mid: number;

  while (low < high) {
    mid = Math.floor(low + (high - low) / 2);

    if (nums[mid] < nums[mid + 1]) {
      // go right side
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
}
