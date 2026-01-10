// https://leetcode.com/problems/count-negative-numbers-in-a-sorted-matrix/



function countNegatives(grid: number[][]): number {
  let n = grid.length;
  let m = grid[0].length,
    row = n - 1,
    col = 0,
    cnt = 0;

  while (row >= 0 && col < m) {
    if (grid[row][col] < 0) {
      row--;
      cnt = cnt + (m - col);
    } else {
      col++;
    }
  }

  return cnt;
}





function countNegatives(grid: number[][]): number {
  // Number of rows
  let n = grid.length;

  // Number of columns
  let m = grid[0].length;

  // Start from bottom-left corner
  let row = n - 1;
  let col = 0;

  // To store total count of negative numbers
  let cnt = 0;

  // Traverse until we go out of bounds
  while (row >= 0 && col < m) {
    // If current element is negative
    if (grid[row][col] < 0) {
      /*
              Since rows are sorted in non-increasing order,
              all elements to the RIGHT of (row, col)
              i.e. from col to m-1 are also negative.
            */
      cnt += m - col;

      // Move one row up
      row--;
    } else {
      /*
              If current element is non-negative,
              move right to find negative numbers.
            */
      col++;
    }
  }

  // Return total count of negative numbers
  return cnt;
}
