class Solution
{
public:
    vector<vector<int>> matrixReshape(vector<vector<int>> &mat, int r, int c)
    {

        vector<vector<int>> ans(r, vector<int>(c));

        if (mat.size() * mat[0].size() != r * c)
            return mat;
        int row = 0;
        int col = 0;

        // Traverse old matrix
        for (int i = 0; i < mat.size(); i++)
        {
            for (int j = 0; j < mat[0].size(); j++)
            {
                // Copy element to new matrix
                ans[row][col] = mat[i][j];
                // move col
                col++;

                // If column is full , move to next row
                if (col == c)
                {
                    col = 0;
                    row++;
                }
            }
        }

        return ans;
    }
};

mat = [
    [ 1, 2 ],
    [ 3, 4 ]
] Old size = 2 × 2 = 4

    New shape : r = 1,
      c = 4 ✅

      New Matrix ini Copy code ans = [[ 0, 0, 0, 0 ]] Step - by - Step Filling i j mat[i][j] row col ans 0 0 1 0 0 [1 _ _ _] 0 1 2 0 1 [1 2 _ _] 1 0 3 0 2 [1 2 3 _] 1 1 4 0 3 [1 2 3 4]

✔ col == c → reset col,
      increment row(done)

🎯 Final Output csharp Copy code[[ 1, 2, 3, 4 ]]