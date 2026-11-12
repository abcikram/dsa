# 209 — Minimum Size Subarray Sum

## Pattern
Variable-Size Sliding Window

Given a positive integer array `nums` and a target, return the minimum length of a **contiguous** subarray whose sum is at least `target`. Return `0` if no such subarray exists.

## TypeScript Solution

```ts
class Solution {
  minSubArrayLen(target: number, nums: number[]): number {
    let left = 0;
    let total = 0;
    let minWindow = Infinity;

    for (let right = 0; right < nums.length; right++) {
      total += nums[right];

      while (total >= target) {
        const windowSize = right - left + 1;
        minWindow = Math.min(minWindow, windowSize);

        total -= nums[left];
        left++;
      }
    }

    return minWindow === Infinity ? 0 : minWindow;
  }
}
```

## How It Works

1. Move `right` forward and add each number to `total` (expand the window).
2. While `total >= target`, the current window is valid: update the minimum length.
3. Remove `nums[left]` from `total` and move `left` forward (shrink the window).
4. If no valid window was found, return `0`.

## Why `while`, Not `if`?

`if` shrinks the window only once. But after removing the leftmost element, the sum may still be at least the target. We must keep shrinking to check every smaller valid window.

Example: `target = 7`, current window is `[3, 1, 2, 4]` (sum = 10).

- Record length `4`.
- Remove `3` → window `[1, 2, 4]`, sum is still `7`.
- Record length `3` too, then keep shrinking.

So the pattern is: **Expand → while valid: update answer → shrink**.

## Complexity

- **Time:** (O(n)) — each element enters and leaves the window at most once.
- **Space:** (O(1)).

**Important:** This sliding-window approach relies on all numbers being positive. With negative numbers, shrinking the window does not guarantee that the sum decreases.
