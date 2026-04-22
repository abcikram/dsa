// Online Typescript Editor for free
// Write, Edit and Run your Typescript code using TS Online Compiler

console.log("Try programiz.pro");

// i
// 1,2,3

// [1] [1,2,3], [2] [1,2,3], [3] [1,2,3];

//                  [1] [1,2,3]
//     [1,1] [1,2,3] => not possible,[1,2] [1,2,3], [1,3] [1,2,3]

//                   [1,2] [1,2,3]
//         [1,2,1] [1,2,3] np, [1,2,2] [1,2,3] np , [1,2,3] [1,2,3]

// here temp === nums.length then push the result array , then return

class Solution {
  result: number[][] = [];
  set = new Set<number>();
  solve(temp: number[], nums: number[]): void {
    // base case
    if (temp.length === nums.length) {
      this.result.push([...temp]);
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      // skip already used
      if (this.set.has(i)) continue;

      // do something
      temp.push(nums[i]!);
      // take set for not duplication
      this.set.add(i);
      // explore
      this.solve(temp, nums);

      // undo
      temp.pop();
      this.set.delete(i);
    }
  }
  permute(nums: number[]): number[][] {
    let n = nums.length;
    let temp: number[] = [];
    this.solve(temp, nums);
    return this.result;
  }
}

const permutation = new Solution();
console.log(permutation.permute([1, 2, 3]));

// [1,2] → call → [1,2,3]
//                   ↓
//               base case
//                   ↓
//                return
//                   ↓
//          undo happens here (at [1,2])

// temp.push(nums[i]);   // ✅ DO (choose)
// set.add(i);           // ✅ mark used

// this.solve(temp, nums, set);  // 🔽 explore

// temp.pop();           // 🔙 UNDO
// set.delete(i);        // 🔙 UNDO

// Tree diagram for [1, 2, 3]

//                     []
//           /           |           \
//        [1]           [2]          [3]
//       /   \         /   \        /   \
//  [1,2] [1,3]   [2,1] [2,3]  [3,1] [3,2]
//    |      |       |      |      |      |
// [1,2,3][1,3,2] [2,1,3][2,3,1][3,1,2][3,2,1]



// 2nd approach without set and temp array , we can swap the elements in the original array and explore the next level of recursion and then undo the swap to restore the original array for the next iteration.

class Solution2 {
  result: number[][] = [];
  n: number = 0;
  solve(idx: number, nums: number[]): void {
    // base case
    if (idx === this.n) {
      this.result.push([...nums]);
      return;
    }

    for (let i = idx; i < this.n; i++) {
      // swap
      this.swap(nums, idx, i);
      // explore
      this.solve(idx + 1, nums);
      // undo
      this.swap(nums, idx, i);
    }
  }

  swap(nums: number[], i: number, j: number): void {
    let temp = nums[i]!;
    nums[i] = nums[j]!;
    nums[j] = temp;
  }

  permute(nums: number[]): number[][] {
    this.n = nums.length;
    this.solve(0, nums);
    return this.result;
  }
}

const permutation2 = new Solution2();
console.log(permutation2.permute([1, 2, 3]));