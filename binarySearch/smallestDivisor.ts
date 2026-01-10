function smallestDivisor(nums: number[], threshold: number): number {
  let low = 1;
  let high = Math.max(...nums);
  let mid;
  let answer = -1;

  while (low < high) {
    mid = Math.floor(low + (high - low) / 2);

    if (isPossibleDivisor(nums, mid, threshold)) {
      answer = mid;
      // go to left
      high = mid;
    } else {
      low = mid + 1;
    }
  }

  return low;
}

function isPossibleDivisor(
  nums: number[],
  divisorNum: number,
  threshold: number
): boolean {
  let sum = 0;
  for (let i = 0; i < nums.length; i++) {
    const ceilvalue = Math.ceil(nums[i] / divisorNum);
    sum += ceilvalue;
  }

  return sum <= threshold;
}

// tc :- O(n log max(nums))
// sc :- O(1)



function smallestDivisor(nums: number[], threshold: number): number {
    // Lowest possible divisor
    let low = 1;

    // Highest possible divisor (max element in nums)
    let high = Math.max(...nums);

    // Binary search on the answer space [1, max(nums)]
    while (low < high) {
        // Find mid divisor
        const mid = Math.floor(low + (high - low) / 2);

        // Check if current divisor is valid
        if (isPossibleDivisor(nums, mid, threshold)) {
            // If valid, try to find a smaller divisor
            high = mid;
        } else {
            // If not valid, increase the divisor
            low = mid + 1;
        }
    }

    // low == high is the smallest valid divisor
    return low;
}

function isPossibleDivisor(
    nums: number[],
    divisorNum: number,
    threshold: number
): boolean {
    let sum = 0;

    // Calculate sum of ceil(nums[i] / divisorNum)
    for (let i = 0; i < nums.length; i++) {
        sum += Math.ceil(nums[i] / divisorNum);

        // Early exit if sum already exceeds threshold
        if (sum > threshold) return false;
    }

    // Check if sum is within threshold
    return sum <= threshold;
}

/*
Time Complexity:
- O(n log max(nums))
  Binary search runs log(max(nums)) times
  Each check takes O(n)

Space Complexity:
- O(1)
  No extra space used
*/
