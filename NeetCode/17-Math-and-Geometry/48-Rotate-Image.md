# LeetCode 48 — Rotate Image

## Problem
Rotate an `n × n` matrix 90 degrees clockwise **in place**, without creating another matrix.

Input:
```ts
[
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]
```
Output:
```ts
[
  [7, 4, 1],
  [8, 5, 2],
  [9, 6, 3]
]
```

## Pattern
**Matrix** — technique: **Transpose + Reverse Each Row**

## Step 1: Transpose
Transpose means swapping rows and columns: the value at `matrix[row][col]` moves to `matrix[col][row]`.

Swap only the upper triangle with the lower triangle. Starting `j` at `i + 1` avoids swapping diagonal elements and avoids undoing each swap.

Before:
```ts
[
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]
```
After transpose:
```ts
[
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9]
]
```

Swaps:
- `matrix[0][1]` (2) with `matrix[1][0]` (4).
- `matrix[0][2]` (3) with `matrix[2][0]` (7).
- `matrix[1][2]` (6) with `matrix[2][1]` (8).

## Step 2: Reverse each row
```ts
[
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9]
]
```
becomes:
```ts
[
  [7, 4, 1],
  [8, 5, 2],
  [9, 6, 3]
]
```
This is the required clockwise rotation.

## TypeScript
```ts
class Solution {
  rotate(matrix: number[][]): void {
    const n = matrix.length;

    // Step 1: Transpose the matrix.
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        [matrix[i][j], matrix[j][i]] =
          [matrix[j][i], matrix[i][j]];
      }
    }

    // Step 2: Reverse each row.
    for (let i = 0; i < n; i++) {
      matrix[i].reverse();
    }
  }
}
```

## Why does this work?
Transpose reflects the matrix across its main diagonal. Reversing every row then places the transposed columns in the positions required for a 90-degree clockwise rotation.

## Complexity
- Time: `O(n²)` — transpose and reversing the rows both take quadratic total work.
- Extra space: `O(1)` — all changes happen in the original matrix.

## Interview explanation
“I rotate in place in two steps. First, I transpose by swapping `matrix[i][j]` with `matrix[j][i]` only when `j > i`. Then I reverse every row. Transpose plus row reversal gives a 90-degree clockwise rotation in O(n²) time and O(1) extra space.”
