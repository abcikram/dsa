//Scan current range
//→ track best future reach
//→ when range ends, jump once


function jump(nums: number[]): number {
  let n = nums.length;
  let currentEnd = 0;
  let farthest = 0;
  let jumps = 0;

  for (let i = 0; i < n - 1; i++) {
    // check farthest
    farthest = Math.max(farthest, i + nums[i]); // kotota maximum jump korte parbo

    // currentPostion jodi maximum jump index ar soman hoye jay
    // tahole jump marbo
    if (i == currentEnd) {
      jumps++;

      // currentEnd ke update korbo , farthest (maxIndex) diye
      currentEnd = farthest;
    }
  }

  return jumps;
}

`
nums = [2, 3, 1, 1, 4]
index:  0  1  2  3  4
We loop only till n-1 = 4 → so i = 0 to 3

Initial state (before loop)
jumps = 0
currentEnd = 0
farthest = 0
🔁 Iteration 1: i = 0
Line 1
farthest = max(0, 0 + nums[0])
         = max(0, 2)
         = 2
State now:

farthest = 2
currentEnd = 0
jumps = 0
Line 2 (if condition)
if (i == currentEnd)  → 0 == 0 ✔
So we execute:

jumps++        → jumps = 1
currentEnd = farthest → currentEnd = 2
✅ Meaning:

First jump completed, range is now [0..2]

🔁 Iteration 2: i = 1
Line 1
farthest = max(2, 1 + nums[1])
         = max(2, 4)
         = 4
State:

farthest = 4
currentEnd = 2
jumps = 1
Line 2
if (1 == 2) ❌
❌ No jump — we are still inside current range.

🔁 Iteration 3: i = 2
Line 1
farthest = max(4, 2 + nums[2])
         = max(4, 3)
         = 4
State:

farthest = 4
currentEnd = 2
jumps = 1
Line 2
if (2 == 2) ✔
So:

jumps++        → jumps = 2
currentEnd = farthest → currentEnd = 4
✅ Meaning:

Second jump completed, range is now [0..4] (end reached)

🔁 Iteration 4: i = 3
Line 1
farthest = max(4, 3 + nums[3])
         = max(4, 4)
         = 4
Line 2
if (3 == 4) ❌
Nothing happens.

Loop ends (i < n-1)
We exit loop and return:

return jumps; → 2
✅ Final Answer
Minimum jumps = 2
🔑 What you MUST notice (very important)
1️⃣ We did NOT jump at every index
We jumped only when:

i == currentEnd
2️⃣ farthest keeps updating EVEN when we don’t jump
Because we are evaluating all options inside the range.

3️⃣ We never process index 4
Because once we reach the last index, no jump is needed.

`;