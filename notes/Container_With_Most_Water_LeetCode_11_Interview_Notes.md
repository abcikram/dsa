# LeetCode 11 — Container With Most Water

## Problem
Given `height[i]` as the height of a vertical line at position `i`, choose two lines that form a container holding the maximum water.

Area:
`(right - left) * Math.min(height[left], height[right])`

## Pattern
**Two Pointers + Greedy pointer movement**

## Approach and reasoning
Start at both ends. Calculate the current area, update the maximum, then move the pointer at the shorter line.

The shorter line limits the water level. Moving the taller line inward would reduce width while the same shorter line would still limit the height, so that move cannot improve the area. Moving the shorter line is the useful move because it may find a taller limiting wall. If the heights are equal, either pointer can move.

## TypeScript
```ts
class Solution {
  maxArea(heights: number[]): number {
    let left = 0;
    let right = heights.length - 1;
    let maxWater = 0;

    while (left < right) {
      const width = right - left;
      const minHeight = Math.min(heights[left], heights[right]);
      const area = width * minHeight;
      maxWater = Math.max(maxWater, area);

      if (heights[left] < heights[right]) {
        left++;
      } else {
        right--;
      }
    }

    return maxWater;
  }
}
```

## Important points
- Do not sort: original index distance determines width.
- Calculate area before moving a pointer.
- When both heights are equal, moving either pointer is valid.

## Complexity
- Time: `O(n)`; pointers only move inward.
- Extra space: `O(1)`.

## Interview explanation
“I begin with maximum possible width using pointers at both ends. The shorter wall limits the area, so after updating the best area I move that shorter wall inward. Moving the taller wall cannot improve the limiting height and also reduces width.”
