# LeetCode 42 — Trapping Rain Water

## Problem
Given non-negative bar heights, calculate the amount of rainwater trapped between them.

Example:
```ts
height = [0,1,0,2,1,0,1,3,2,1,2,1]
// output: 6
```

## Pattern
**Two Pointers + Greedy**

## Per-index formula
```ts
waterAtI = Math.max(0, Math.min(maxLeft, maxRight) - height[i]);
```
- `maxLeft`: tallest bar from the beginning through the current index.
- `maxRight`: tallest bar from the current index through the end.
- The shorter boundary determines the water level.
- Subtract the current bar height; clamp at zero.

At index 5 in the example: current height = 0, maxLeft = 2, maxRight = 3, so water = `min(2, 3) - 0 = 2`.

At index 3: current height = 2, maxLeft = 2, maxRight = 3. The water level is 2, equal to the bar height, so no water is trapped there.

## Brute force
For each index, scan left and right to find both maxima, then apply the formula.
- Time: `O(n²)`
- Extra space: `O(1)`

## Optimized two-pointer reasoning
Maintain `left`, `right`, `leftMax`, `rightMax`, and `totalWater`.

Process the side with the smaller current boundary:
- If `height[left] <= height[right]`, the right boundary is high enough that the left maximum determines the water level for the current left position. Add `leftMax - height[left]` when the current bar is below `leftMax`, then move left.
- Otherwise, process the right side symmetrically using `rightMax - height[right]`, then move right.

This is why the optimized code does not need `Math.min(leftMax, rightMax)` at every step: the pointer comparison guarantees which side's maximum is the limiting boundary for the side currently processed.

## TypeScript
```ts
class Solution {
  trap(height: number[]): number {
    if (height.length === 0) return 0;

    let left = 0;
    let right = height.length - 1;
    let leftMax = 0;
    let rightMax = 0;
    let totalWater = 0;

    while (left < right) {
      if (height[left] <= height[right]) {
        if (height[left] >= leftMax) {
          leftMax = height[left];
        } else {
          totalWater += leftMax - height[left];
        }
        left++;
      } else {
        if (height[right] >= rightMax) {
          rightMax = height[right];
        } else {
          totalWater += rightMax - height[right];
        }
        right--;
      }
    }
    return totalWater;
  }
}
```

## What does `totalWater += ...` mean?
`totalWater += leftMax - height[left]` is shorthand for `totalWater = totalWater + (leftMax - height[left])`. It adds the water above the current bar to the running total.

Each bar has width 1, so adding the water height per index is equivalent to adding each column's volume (height × width). This differs from Container With Most Water, where the width between the chosen lines varies and must appear explicitly in the area formula.

## Per-index dry run
| Index | Height | Max Left | Max Right | Water |
|---:|---:|---:|---:|---:|
| 0 | 0 | 0 | 3 | 0 |
| 1 | 1 | 1 | 3 | 0 |
| 2 | 0 | 1 | 3 | 1 |
| 3 | 2 | 2 | 3 | 0 |
| 4 | 1 | 2 | 3 | 1 |
| 5 | 0 | 2 | 3 | 2 |
| 6 | 1 | 2 | 3 | 1 |
| 7 | 3 | 3 | 2 | 0 |
| 8 | 2 | 3 | 2 | 0 |
| 9 | 1 | 3 | 2 | 1 |
| 10 | 2 | 3 | 2 | 0 |
| 11 | 1 | 3 | 1 | 0 |

Total = `1 + 1 + 2 + 1 + 1 = 6`.

## Complexity
- Time: `O(n)`
- Extra space: `O(1)`

## Interview explanation
“I maintain the maximum height seen from each side and process the side with the smaller current boundary. On that side, the opposite boundary is guaranteed to be high enough, so the water level is determined by the maximum on the processed side. I add the difference when the current bar is lower, then move that pointer inward.”
