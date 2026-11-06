// Online Typescript Editor for free
// Write, Edit and Run your Typescript code using TS Online Compiler

console.log("Try programiz.pro");

function searchMatrix(matrix: number[][], target: number): boolean {
  let n = matrix.length ?? 0;
  let m = matrix[0]!.length ?? 0;

  let low = 0;
  let high = n * m - 1;
  let mid: number;

  while (low <= high) {
    mid = Math.floor(low + (high - low) / 2);
    let row = Math.floor(mid / m);
    let col = mid % m;  // we do not use Math.floor here because col always will be less than m

    if (matrix[row][col]! === target) {
      return true;
    } else if (matrix[row][col] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return false;
}

// Time Complexity: O(log(m × n))

// Space Complexity: O(1)

console.log(
  searchMatrix(
    [
      [1, 3, 5, 7],
      [10, 11, 16, 20],
      [23, 30, 34, 60],
    ],
    23
  )
);
