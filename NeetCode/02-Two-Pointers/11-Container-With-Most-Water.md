# LeetCode 11 — Container With Most Water

**Pattern:** Two Pointers + Greedy  
**Difficulty:** Medium

## 1. Problem Statement (Banglish)

Tomake ekta integer array `height` dewa ache. Prottekta value ekta vertical line-er height represent kore. Tomar kaj holo duটো line choose kora, jader majhe maximum amount of water store kora possible.

- Duto line-er index difference = width.
- Duto line-er moddhe choto height = water-er maximum height.
- Maximum area return korte hobe.

Example:

```typescript
height = [1, 8, 6, 2, 5, 4, 8, 3, 7];
// Output: 49
```

Index `1` and `8` choose korle:

```typescript
width = 8 - 1 = 7;
minHeight = Math.min(8, 7) = 7;
area = 7 * 7 = 49;
```

## 2. Formula

```typescript
const width = right - left;
const minHeight = Math.min(height[left], height[right]);
const area = width * minHeight;
```

`Math.min()` use kori karon water shorter wall-er height porjonto-i dhore rakha possible.

## 3. Approach — Two Pointers

1. `left = 0` and `right = height.length - 1` initialize korbo.
2. `right - left` diye width calculate korbo.
3. `Math.min(height[left], height[right])` diye shorter wall ber korbo.
4. `width * minHeight` diye area calculate korbo.
5. `maxWater = Math.max(maxWater, area)` diye maximum update korbo.
6. Shorter wall-er pointer move korbo:
   - Left shorter hole `left++`.
   - Right shorter or equal hole `right--`.
7. `left < right` jotokkhon true, repeat korbo.

### Why move the shorter wall?

Current area shorter wall-er height diye limited. Taller wall move korle width kome, kintu shorter wall fixed thake—tai better area pawar chance nei. Shorter wall move korle taller wall pawar chance thake, ja area improve korte pare.

## 4. Complete TypeScript Solution

```typescript
class Solution {
    /**
     * @param {number[]} heights
     * @return {number}
     */
    maxArea(heights: number[]): number {
        let left = 0;
        let right = heights.length - 1;
        let maxWater = 0;

        while (left < right) {
            const width = right - left;

            const minHeight = Math.min(
                heights[left],
                heights[right]
            );

            const area = width * minHeight;
            maxWater = Math.max(maxWater, area);

            // Move the shorter wall
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

## 5. Dry Run — Different Example

Input:

```typescript
height = [3, 1, 2, 4, 5];
```

Index mapping:

```text
Index:    0  1  2  3  4
Height:   3  1  2  4  5
```

Initial: `left = 0`, `right = 4`, `maxWater = 0`.

### Iteration 1

```typescript
width = 4 - 0 = 4;
minHeight = Math.min(3, 5) = 3;
area = 4 * 3 = 12;
maxWater = 12;
```

Left height `3` is shorter, so `left++`. Now `left = 1`, `right = 4`.

### Iteration 2

```typescript
width = 4 - 1 = 3;
minHeight = Math.min(1, 5) = 1;
area = 3 * 1 = 3;
maxWater = Math.max(12, 3) = 12;
```

Left height `1` is shorter, so `left++`. Now `left = 2`, `right = 4`.

### Iteration 3

```typescript
width = 4 - 2 = 2;
minHeight = Math.min(2, 5) = 2;
area = 2 * 2 = 4;
maxWater = Math.max(12, 4) = 12;
```

Left height `2` is shorter, so `left++`. Now `left = 3`, `right = 4`.

### Iteration 4

```typescript
width = 4 - 3 = 1;
minHeight = Math.min(4, 5) = 4;
area = 1 * 4 = 4;
maxWater = Math.max(12, 4) = 12;
```

Left height `4` is shorter, so `left++`. Now `left = 4`, `right = 4`. Loop stops because `left < right` is false.

### Dry-run table

| Iteration | Left | Right | Width | Min Height | Area | Max Water |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | 0 | 4 | 4 | 3 | 12 | 12 |
| 2 | 1 | 4 | 3 | 1 | 3 | 12 |
| 3 | 2 | 4 | 2 | 2 | 4 | 12 |
| 4 | 3 | 4 | 1 | 4 | 4 | 12 |

**Final output: `12`**

## 6. Complexity Analysis

### Time Complexity: `O(n)`

Each iteration moves either `left` forward or `right` backward. Each pointer moves at most `n` times, so total iterations are at most `n - 1`.

[
oxed{O(n)}
]

### Auxiliary Space Complexity: `O(1)`

Only a fixed number of variables are used (`left`, `right`, `width`, `minHeight`, `area`, `maxWater`). Extra memory does not grow with input size.

[
oxed{O(1)}
]

| Approach | Time | Auxiliary Space |
|---|---:|---:|
| Brute force (check every pair) | `O(n²)` | `O(1)` |
| Two Pointers | `O(n)` | `O(1)` |

## 7. Brute Force vs Optimal

Brute force checks every pair:

```typescript
let maxWater = 0;

for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
        const width = j - i;
        const minHeight = Math.min(height[i], height[j]);
        const area = width * minHeight;
        maxWater = Math.max(maxWater, area);
    }
}

return maxWater;
```

- Brute force: `O(n²)` time, `O(1)` auxiliary space.
- Two Pointers: `O(n)` time, `O(1)` auxiliary space.

## 8. Common Interview Questions

**Q1. Why `Math.min()` instead of `Math.max()`?**  
Water can only reach the shorter wall's height. Otherwise, it spills over.

**Q2. Why move the shorter pointer?**  
The shorter wall limits the current area. Moving the taller wall reduces width without improving that limiting height. Moving the shorter wall gives a chance to find a taller boundary.

**Q3. Why `left < right`?**  
A container needs two different lines. When pointers meet, width is zero.

**Q4. Why don't we sort the array?**  
Original index positions determine width. Sorting changes the order and distances between lines.

**Q5. What if both heights are equal?**  
Either pointer can move. This implementation moves `right` because the `if` condition is false.

**Q6. What are the complexities?**  
Time: `O(n)`. Auxiliary space: `O(1)`.

## 9. Interview-ready Explanation

"We use the Two Pointers technique. Initially, one pointer is at the beginning and the other is at the end of the array. We calculate the area using the distance between the pointers multiplied by the minimum of their heights. We update the maximum area and move the pointer pointing to the shorter line, because the shorter line limits the water capacity. We repeat this process until both pointers meet. This gives us `O(n)` time and `O(1)` auxiliary space."

## 10. Key Takeaways

- Pattern: **Two Pointers + Greedy**
- Formula: `width * Math.min(leftHeight, rightHeight)`
- Move the shorter wall.
- Do not sort the input.
- Time Complexity: `O(n)`
- Auxiliary Space: `O(1)`

## 11. Revision Checklist

- [ ] I understand why we use `Math.min()`.
- [ ] I understand why we move the shorter pointer.
- [ ] I can dry run the algorithm without looking at the solution.
- [ ] I can explain why sorting is not needed.
- [ ] I can explain `O(n)` time complexity.
- [ ] I can explain `O(1)` auxiliary space.
- [ ] I can write the TypeScript solution from memory.

**Practice tip:** Code memorize korar cheye pointer move korar reason-ta explain korte practice koro.