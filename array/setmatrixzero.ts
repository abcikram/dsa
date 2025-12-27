function setZeroes(matrix: number[][]): void {
  const n = matrix.length;
  const m = matrix[0].length;

  const row: number[] = new Array(n).fill(0);
  const col: number[] = new Array(m).fill(0);

  // Step 1: mark rows and columns that contain 0
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (matrix[i][j] === 0) {
        row[i] = 1;
        col[j] = 1;
      }
    }
  }

  // Step 2: update matrix using markers
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      if (row[i] === 1 || col[j] === 1) {
        matrix[i][j] = 0;
      }
    }
  }
}
``