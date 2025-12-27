class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int n = matrix.size();
        int m = matrix[0].size();

        vector<int>row(n,0);
        vector<int>col(m,0);

        for(int i=0;i<n;i++){
            for(int j=0;j<m;j++) {
                if(matrix[i][j] == 0){
                 row[i] =1;
                col[j] =1;
                }
             
            }
        }

       for(int i=0;i<n;i++){
            for(int j=0;j<m;j++) {
              if(row[i] || col[j]){
                matrix[i][j] = 0;
              }
            }
        }

    }

};
















// optimal :- 

#include <bits/stdc++.h>

void setZeros(vector<vector<int>> &matrix)
{
	// Write your code here.

    int n = matrix.size();
	int m = matrix[0].size();

	bool firstRowZero = 0;
	bool firstColZero = 0;

    // check first row zero or not 
	for(int i=0;i<n;i++){
		if(matrix[i][0] == 0){
			firstColZero = true;
		}
	}

    //check first col zero or not
	for(int j=0;j<m;j++){
		if(matrix[0][j] == 0) {
			firstRowZero = true;
		}
	}

	// use 1st row and col as mark 
	for(int i=1;i<n;i++){
		for(int j=1;j<m;j++){
			if(matrix[i][j] == 0){
				matrix[i][0] = 0;
				matrix[0][j] = 0;
			}
		}
	}

	// set cells to zero using marker
	for(int i=1;i<n;i++){
		for(int j=1;j<m;j++){
			if(matrix[i][0]==0 || matrix[0][j] ==0){
				matrix[i][j] = 0;
			}
		}
	}

	// handle first row and first col

	if(firstColZero){
		for(int i=0;i<n;i++){
			matrix[i][0] = 0;
		}
	}

	if(firstRowZero){
		for(int j=0;j<m;j++){
			matrix[0][j] =0;
		}
	}

}