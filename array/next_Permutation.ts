/**
 Do not return anything, modify nums in-place instead.
 */
function nextPermutation(nums: number[]): void {
  // find the longest prefix
  // find the break point [1,2,3], 2 is break point
  // n-2 start becouse ex:- 2 1 5 4 3 0 0
  // itarate start form 2nd last 0
  let breakPoint = -1;
  let n = nums.length;
  for (let i = n - 2; i >= 0; i--) {
    if (nums[i] < nums[i + 1]) {
      // break point 1 , index 1
      breakPoint = i;
      break;
    }
  }
  console.log(breakPoint);
  // edge case if break point not found reverse array
  if (breakPoint == -1) {
    reverse(nums, 0, n - 1);
    return;
  }

  // 2nd after break point remaning number find the number which greatere than
  // break point but close to break point , end = last number to breakpoint itarate

  for (let i = n - 1; i > breakPoint; i--) {
    // 2 3 5 4 1 0 0
    if (nums[i] > nums[breakPoint]) {
      swap(nums, i, breakPoint);
      break; // swap one time then stop
    }
  }

  /// now remaing array will be reverse
  reverse(nums, breakPoint + 1, n - 1); // 2 3 0 0 1 4 5
}

function reverse(nums: number[], start: number, end: number): number[] {
  // console.log("reverse__", nums, start ,end)
  while (start < end) {
    let temp = nums[start];
    nums[start] = nums[end];
    nums[end] = temp;
    start++;
    end--;
  }

  // console.log("reverse", nums)

  return nums;
}

function swap(nums: number[], start: number, end: number): number[] {
  // console.log("swap", start, end )

  let temp = nums[start];
  nums[start] = nums[end];
  nums[end] = temp;

  return nums;
}


Example 1:

Input: nums = [1,2,3]
Output: [1,3,2]
Example 2:

Input: nums = [3,2,1]
Output: [1,2,3]
Example 3:

Input: nums = [1,1,5]
Output: [1,5,1]