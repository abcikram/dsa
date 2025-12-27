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


/// optimal :-

function setZeroes(matrix: number[][]): void {
  const n = matrix.length;
  const m = matrix[0].length;

  let firstRowZero = false;
  let firstColZero = false;

  // Step 1: Check first row
  for (let j = 0; j < m; j++) {
    if (matrix[0][j] === 0) {
      firstRowZero = true;
      break;
    }
  }

  // Step 2: Check first column
  for (let i = 0; i < n; i++) {
    if (matrix[i][0] === 0) {
      firstColZero = true;
      break;
    }
  }

  // Step 3: Use first row & column as markers
  for (let i = 1; i < n; i++) {
    for (let j = 1; j < m; j++) {
      if (matrix[i][j] === 0) {
        matrix[i][0] = 0;
        matrix[0][j] = 0;
      }
    }
  }

  // Step 4: Set zeros based on markers
  for (let i = 1; i < n; i++) {
    for (let j = 1; j < m; j++) {
      if (matrix[i][0] === 0 || matrix[0][j] === 0) {
        matrix[i][j] = 0;
      }
    }
  }

  // Step 5: Zero first row if needed
  if (firstRowZero) {
    for (let j = 0; j < m; j++) {
      matrix[0][j] = 0;
    }
  }

  // Step 6: Zero first column if needed
  if (firstColZero) {
    for (let i = 0; i < n; i++) {
      matrix[i][0] = 0;
    }
  }
}
