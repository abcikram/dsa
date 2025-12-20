let arr = [2, 6, 5, 8, 11], target = 10;

// brute force approach
// function twoSum(nums: number[], target: number): number[] {
//     for(let i=0;i<nums.length;i++){
//         for(let j=0;j<nums.length;j++){
//             if(i == j) continue;
//             if(nums[i]!+nums[j]! === target){
//                 return [i, j]
//             }
//         }
//     }
//     return [-1,-1]
// };

// optimized approach (hashmap)
const twoSum = (arr:number[], target:number):number[] => {
    let numMap = new Map<number, number>();
    for (let i = 0; i < arr.length; i++) {
        let num:number = arr[i]!;
        let complement = target - num;
        if (!numMap.has(complement)) {
            numMap.set(num, i);
        }
        else {
            return [numMap.get(complement)!, i];
        }
    }

    return [-1, -1];
};





// optimized approach (two pointer) this is for only if return value is needed not indices

// time complexity: O(n log n) due to sorting [o(n)+o(n log n)]
// Each pointer moves at most N times:
// space complexity: O(1)
const twoSum = (arr: number[], target: number): boolean => {
    let left = 0;
    let right = arr.length - 1;
    arr.sort((a, b) => a - b);
    while (left < right) {
        let sum = arr[left]! + arr[right]!
        if (sum === target) {
            return true
        } else if (sum > target) {
            right --
        } else {
            left++
        }
    }
    return false

};


console.log("Two sum indices:", twoSum(arr, target));















//++++++++++++++++++++++++++++++ in c++ //++++++++++++++++++++++++++++++++++


// string read(int n, vector<int> book, int target)
// {
//     // Write your code here.
//     int left= 0;
//     int right = n-1;
//     sort(book.begin(), book.end());

//     while(left<right){
//         int sum = book[left]+book[right];
//         if(sum == target){
//             return "YES";
//         }else if(sum < target) {
//             left ++;
//         }else {
//          right --;
//         }
//     }


//     return "NO";
// }