// Hashmap approach
// time complexity: O(n)
// space complexity: O(n)

// function majorityElement(nums: number[]): number {
//   let map = new Map<number, number>();
//   let N = nums.length;
//   for (let num of nums) {
//     map.set(num, (map.get(num) || 0) + 1);

//     if (map.get(num)! > Math.floor(N / 2)) return num;
//   }

//   return -1;
// }

// brute force approach
// time complexity: O(n^2)
// space complexity: O(1)
// function majorityElement(nums: number[]): number {
//   let N = nums.length;
//   for (let i = 0; i < N; i++) {
//     let count = 0;
//     for (let j = 0; j < N; j++) {
//       if (nums[j] === nums[i]) {
//         count++;
//       }
//     }

//     if (count > Math.floor(N / 2)) {
//       return nums[i]!;
//     }
//   }

//   return -1;
// }

// Boyer-Moore Voting Algorithm
// time complexity: O(n)
// space complexity: O(1)
function majorityElement(nums: number[]): number {
     let elem!:number;
     let count = 0;
     for(let i=0;i<nums.length;i++){
        if(count===0){
            elem = nums[i]!;
            count++;
        }else if(nums[i] == elem){
            count++
        }else {
            count--;
        }
     }

    let count1=0
     // verify that elem is mojority or not 
     for(let i=0;i<nums.length;i++){
        if(nums[i] === elem) count1++;
     }

     if(count1 > Math.floor(nums.length/2)) return elem!;

     return -1
};

console.log(majorityElement([3, 2, 3]));
