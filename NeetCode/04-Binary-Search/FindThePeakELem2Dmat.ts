Optimal Approach (Binary Search on Columns)
Steps:

//1. Take mid column

//2. Find the row with maximum value in that column

//3. Compare it with left and right neighbors

//4. Decide where the peak lies



// https://chatgpt.com/share/696cad1e-66a4-800c-b4ea-9de46611812d



function findPeakGrid(mat: number[][]): number[] {
    let n= mat.length; // number of row 
    let m = mat[0].length;  // number of columm
    let left = 0;  
    let right = m - 1;

    let mid:number;

    while(left<=right){
        mid = Math.floor(left+(right-left)/2);

        // we use mid as columm

        // Step 1: mid column এ max element এর row খুঁজি
        let maxRow = 0;
        for(let r=0;r<n;r++){
            if(mat[r][mid] > mat[maxRow][mid]){
                maxRow = r
            }
        }

        console.log(maxRow)

        // step 2 mat[maxRow][mid] is current value , search that that is greater 
        // than left and right value or not

        let currentVal = mat[maxRow][mid];
        let leftVal = mid - 1 >= 0 ? mat[maxRow][mid-1] : -1
        let rightVal = mid + 1 < m ? mat[maxRow][mid + 1] : -1 
        
        // if currentVal is greater than left and right value then we found our peak element
        // otherwise we will go to that side where value is greater
        // if leftVal > currentVal then go to left side otherwise go to right side

        if(currentVal > leftVal && currentVal > rightVal) {
            return [maxRow, mid]
        } else if(leftVal > currentVal){
            // left peak so go to left side
            right = mid - 1
        }else {
            // right peak , go to right side
            left = mid + 1
        }

    }

    return [-1,-1]
    
};