# LeetCode 15 — 3Sum Interview Notes

## Problem
Return all unique triplets whose values sum to zero. Duplicate triplets are not allowed.

## Pattern
**Sorting + Two Pointers**

## Approach
1. Sort the array.
2. Fix one value at index `i`.
3. Use `left = i + 1` and `right = nums.length - 1` to search for two values summing to `-nums[i]`.
4. If the sum is too small, move `left` right. If too large, move `right` left.
5. When the sum is zero, record the triplet, move both pointers, and skip duplicates.

## TypeScript
```ts
class Solution {
  threeSum(nums: number[]): number[][] {
    const result: number[][] = [];
    nums.sort((a, b) => a - b);

    for (let i = 0; i < nums.length - 2; i++) {
      if (i > 0 && nums[i] === nums[i - 1]) continue;

      let left = i + 1;
      let right = nums.length - 1;

      while (left < right) {
        const sum = nums[i] + nums[left] + nums[right];

        if (sum === 0) {
          result.push([nums[i], nums[left], nums[right]]);
          left++;
          right--;

          while (left < right && nums[left] === nums[left - 1]) left++;
          while (left < right && nums[right] === nums[right + 1]) right--;
        } else if (sum < 0) {
          left++;
        } else {
          right--;
        }
      }
    }
    return result;
  }
}
```

## Duplicate handling
- Skip an index `i` if its value equals the previous fixed value.
- After recording a triplet, skip repeated values at both pointers.
- We need unique value-triplets, not unique index combinations.

## TypeScript pitfall
Use `result.push([nums[i], nums[left], nums[right]])`. Do not wrap a comma-separated expression in parentheses: `(a, b, c)` evaluates to only `c` because of the comma operator.

## Complexity
- Time: `O(n²)` including the dominant two-pointer search (sorting is `O(n log n)`).
- Extra space: typically stated as `O(1)` excluding sorting implementation details and output; output space is separate.

## Interview explanation
“I sort the array so the two pointers can move monotonically. For each fixed first value, I search the remaining range for a pair with the required sum. Sorted order tells me which pointer to move, and skipping equal values prevents duplicate triplets.”
