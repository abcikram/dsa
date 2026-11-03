# LeetCode 42 — Trapping Rain Water

> **Pattern:** Two Pointers  
> **Technique:** Greedy  
> **Language:** TypeScript

## 1. Problem statement — সহজ বাংলায়

তোমাকে একটি integer array `height` দেওয়া আছে। প্রতিটি element একটি vertical bar-এর height বোঝায়। প্রতিটি bar-এর width **1 unit**। বৃষ্টি হলে bar-গুলোর মাঝে মোট কত units জল জমবে, তা return করতে হবে।

Example:

```ts
height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output = 6
```

## 2. কেন জল জমে?

ধরো:

```ts
height = [3, 1, 3]
```

মাঝের bar-এর height 1। বাম ও ডান boundary দুটোই 3। তাই মাঝখানে জল উঠতে পারে 3 পর্যন্ত।

```text
water = min(3, 3) - 1
      = 2 units
```

মূল ধারণা: কোনো position-এ জল কতটা উঠতে পারবে, তা বাম ও ডান পাশের ছোট boundary ঠিক করে। তার থেকে current bar-এর height বাদ দিলে ওই position-এর জল পাওয়া যায়।

## 3. মূল formula

প্রতিটি index `i`-এর জন্য:

\[
water[i] = \max(0,\min(maxLeft,maxRight)-height[i])
\]

- `height[i]`: current bar-এর নিজের height।
- `maxLeft`: current index-এর বাম পাশে সর্বোচ্চ height।
- `maxRight`: current index-এর ডান পাশে সর্বোচ্চ height।
- `min(maxLeft, maxRight)`: ছোট boundary; এর বেশি জল ধরে রাখা যাবে না।
- `max(0, ...)`: জল negative হতে পারে না।

### maxLeft / maxRight কীভাবে বের করব?

```ts
height = [2, 1, 4, 1, 3]
index  =  0  1  2  3  4
```

আমরা index 3-এ আছি। Current height `1`।

- বাম পাশের values `[2, 1, 4]` → maximum `4` → `maxLeft = 4`।
- ডান পাশের values `[3]` → maximum `3` → `maxRight = 3`।

তাই:

```text
water[3] = min(4, 3) - 1
         = 2
```

## 4. Brute Force approach

প্রতিটি index-এর জন্য বাম ও ডান দিক scan করে maximum বের করি, তারপর formula প্রয়োগ করি।

```ts
class Solution {
  trap(height: number[]): number {
    let totalWater = 0;

    for (let i = 0; i < height.length; i++) {
      let maxLeft = 0;
      let maxRight = 0;

      for (let j = 0; j <= i; j++) {
        maxLeft = Math.max(maxLeft, height[j]);
      }

      for (let j = i; j < height.length; j++) {
        maxRight = Math.max(maxRight, height[j]);
      }

      const water = Math.max(
        0,
        Math.min(maxLeft, maxRight) - height[i]
      );

      totalWater += water;
    }

    return totalWater;
  }
}
```

- **Time:** `O(n²)` — প্রতিটি index-এর জন্য আবার বাম ও ডান দিকে scan।
- **Space:** `O(1)` — extra array নেই।

## 5. Optimal approach — Two Pointers

দুই প্রান্ত থেকে শুরু করব। প্রতিবার যে পাশের current height ছোট, সেই পাশ process করব।

### Variables

```ts
let left = 0;
let right = height.length - 1;

let leftMax = 0;
let rightMax = 0;

let totalWater = 0;
```

- `left`: বাম pointer-এর index।
- `right`: ডান pointer-এর index।
- `leftMax`: বাম দিক থেকে এখন পর্যন্ত দেখা সর্বোচ্চ height।
- `rightMax`: ডান দিক থেকে এখন পর্যন্ত দেখা সর্বোচ্চ height।
- `totalWater`: সব position-এর জমা জল যোগ করে রাখে।

### কেন smaller side process করি?

এটাই সবচেয়ে গুরুত্বপূর্ণ logic।

যদি:

```ts
height[left] <= height[right]
```

তাহলে বাম দিক process করা নিরাপদ। কারণ `right`-এর current height অন্তত `height[left]`-এর সমান। আর `leftMax` হলো বাম দিকে দেখা maximum, তাই `leftMax >= height[left]`। ফলে ডান দিকে অন্তত `leftMax`-এর সমান বা তার চেয়ে উঁচু boundary আছে:

```text
rightMax >= leftMax
```

তাই:

```text
min(leftMax, rightMax) = leftMax
```

মূল formula:

```text
min(leftMax, rightMax) - height[left]
```

সরল হয়ে যায়:

```text
leftMax - height[left]
```

এই কারণেই code-এ `Math.min(leftMax, rightMax)` লিখতে হয় না।

একইভাবে, right side ছোট হলে:

```text
leftMax >= rightMax
min(leftMax, rightMax) = rightMax
```

তাই ডান দিকে জমা জল:

```text
rightMax - height[right]
```

## 6. Optimal TypeScript solution

```ts
class Solution {
  trap(height: number[]): number {
    if (height.length === 0) return 0;

    let left = 0;
    let right = height.length - 1;

    let leftMax = 0;
    let rightMax = 0;

    let totalWater = 0;

    while (left < right) {
      if (height[left] <= height[right]) {
        if (height[left] >= leftMax) {
          leftMax = height[left];
        } else {
          totalWater += leftMax - height[left];
        }

        left++;
      } else {
        if (height[right] >= rightMax) {
          rightMax = height[right];
        } else {
          totalWater += rightMax - height[right];
        }

        right--;
      }
    }

    return totalWater;
  }
}
```

### Code line by line

**A. Empty input**

```ts
if (height.length === 0) return 0;
```

Array খালি হলে কোনো bar নেই, তাই জলও নেই।

**B. Initialize**

```ts
let left = 0;
let right = height.length - 1;
let leftMax = 0;
let rightMax = 0;
let totalWater = 0;
```

দুই প্রান্ত থেকে শুরু করছি। Maximum-গুলো এবং মোট জল 0 দিয়ে শুরু।

**C. Loop**

```ts
while (left < right)
```

যতক্ষণ দুই pointer একে অপরকে cross করেনি, ততক্ষণ কাজ চলবে।

**D. Left process**

```ts
if (height[left] <= height[right]) {
  if (height[left] >= leftMax) {
    leftMax = height[left];
  } else {
    totalWater += leftMax - height[left];
  }
  left++;
}
```

- Left current height ছোট বা সমান হলে left process করি।
- Current height আগের `leftMax`-এর সমান বা বড় হলে নতুন maximum মনে রাখি; এখানে জল জমে না।
- Current height `leftMax`-এর চেয়ে ছোট হলে `leftMax - height[left]` পরিমাণ জল জমে।
- তারপর `left++`।

**E. Right process**

```ts
else {
  if (height[right] >= rightMax) {
    rightMax = height[right];
  } else {
    totalWater += rightMax - height[right];
  }
  right--;
}
```

একই logic ডান দিকের জন্য:
- নতুন height `rightMax`-এর সমান বা বড় হলে maximum update।
- ছোট হলে `rightMax - height[right]` জল যোগ।
- তারপর `right--`।

**F. Return**

```ts
return totalWater;
```

সব position process হয়ে গেলে মোট জল return করি।

## 7. `totalWater += ...` মানে কী?

```ts
totalWater += leftMax - height[left];
```

মানে current position-এ জমা জলের পরিমাণ বের করে আগের total-এর সঙ্গে যোগ করা।

এটা একই:

```ts
totalWater = totalWater + (leftMax - height[left]);
```

উদাহরণ:

```ts
totalWater = 2;
leftMax = 4;
height[left] = 1;

totalWater += 4 - 1;
// totalWater = 2 + 3 = 5
```

`totalWater` হলো সব position-এর trapped water-এর মোট volume, শুধু area নয়।

## 8. কেন `height × width` লিখছি না?

এই problem-এ প্রতিটি bar-এর width fixed `1` unit।

```text
Water volume at one position = water height × width
                             = water height × 1
                             = water height
```

যদি width 2 হতো, প্রতিটি position-এর জল `waterHeight × 2` হতো। কিন্তু এখানে width সবসময় 1, তাই আলাদা multiplication নেই।

- **Container With Most Water:** দুই bar-এর মাঝের distance পরিবর্তনশীল, তাই `width × min(height[left], height[right])`।
- **Trapping Rain Water:** প্রতিটি index-এর width fixed 1; প্রতিটি index-এর জল বের করে যোগ করি।

## 9. Full example: কীভাবে answer 6 হয়?

```ts
height = [0,1,0,2,1,0,1,3,2,1,2,1]
index  =  0 1 2 3 4 5 6 7 8 9 10 11
```

প্রতিটি index-এর জল:

| Index | Height | Max Left | Max Right | Trapped water |
|---:|---:|---:|---:|---:|
| 0 | 0 | 0 | 3 | 0 |
| 1 | 1 | 1 | 3 | 0 |
| 2 | 0 | 1 | 3 | 1 |
| 3 | 2 | 2 | 3 | 0 |
| 4 | 1 | 2 | 3 | 1 |
| 5 | 0 | 2 | 3 | 2 |
| 6 | 1 | 2 | 3 | 1 |
| 7 | 3 | 3 | 2 | 0 |
| 8 | 2 | 3 | 2 | 0 |
| 9 | 1 | 3 | 2 | 1 |
| 10 | 2 | 3 | 2 | 0 |
| 11 | 1 | 3 | 1 | 0 |

যেসব index-এ জল জমেছে:

- Index 2 → 1 unit
- Index 4 → 1 unit
- Index 5 → 2 units
- Index 6 → 1 unit
- Index 9 → 1 unit

```text
Total = 1 + 1 + 2 + 1 + 1
      = 6 units
```

এই table প্রতিটি index-এর বাম ও ডান maximum ধরে formula বোঝানোর জন্য। Two Pointers code একই হিসাব করে, কিন্তু সব index-এর জন্য বারবার দুই পাশ scan করে না।

## 10. Index 3 নিয়ে doubt

Original array-তে index 3-এর height `2`।

- বাম পাশের maximum = `1`।
- ডান পাশের maximum = `3`।

```text
water[3] = min(1, 3) - 2
         = -1
```

জল negative হতে পারে না, তাই actual water = 0।

কেন? বাম পাশের সর্বোচ্চ bar height 1, কিন্তু current bar-এর height 2। বাম দিক থেকে current bar-এর ওপরে জল ধরে রাখার মতো উঁচু boundary নেই।

## 11. `Math.min(leftMax, rightMax)` code-এ নেই কেন?

সাধারণ formula:

```ts
water = Math.min(leftMax, rightMax) - height[i];
```

Two Pointers-এ:

- Left process করার সময় `leftMax <= rightMax` নিশ্চিত থাকে। তাই minimum হলো `leftMax`।
- Right process করার সময় `rightMax < leftMax` থাকে। তাই minimum হলো `rightMax`।

তাই code সরাসরি লেখে:

```ts
// Left process
totalWater += leftMax - height[left];

// Right process
totalWater += rightMax - height[right];
```

Formula বদলায়নি; condition ব্যবহার করে simplify করা হয়েছে।

## 12. Complexity

| Complexity | Value | Explanation |
|---|---|---|
| Time | `O(n)` | দুই pointer একে অপরের দিকে move করে; প্রতিটি index সর্বোচ্চ একবার process হয়। |
| Space | `O(1)` | কয়েকটি variable ছাড়া extra array লাগে না। |

## 13. Interview-এ কীভাবে explain করবে?

"I use two pointers, one at the beginning and one at the end. I maintain the maximum height seen from each side. At every step, I process the side with the smaller current height. That side's maximum boundary determines the trapped water at the current position, so I add the difference between that maximum and the current height. Then I move that pointer inward. I continue until the pointers meet and return the accumulated water."

## 14. Common mistakes

1. শুধু পাশের immediate bar দেখা — সর্বোচ্চ boundary খুঁজতে হবে।
2. `leftMax` / `rightMax` reset করা — এগুলো loop-এর বাইরে initialize করতে হবে।
3. জল negative হতে দেওয়া — current height maximum-এর চেয়ে ছোট না হলে জল যোগ হয় না।
4. Pointer ভুল দিকে move করা — Left process হলে `left++`; Right process হলে `right--`।
5. `totalWater`-কে area ভাবা — এটা total trapped water volume-এর numeric value। Width 1 বলে আলাদা multiplication নেই।
6. `Math.min()` না দেখে formula ভুলে যাওয়া — optimized code-এ condition-এর কারণেই minimum side আগে থেকে জানা থাকে।

## 15. Revision checklist

- [ ] `maxLeft` কী?
- [ ] `maxRight` কী?
- [ ] কেন দুই পাশের ছোট boundary জল নির্ধারণ করে?
- [ ] কেন smaller side process করি?
- [ ] Left process করলে কেন `leftMax - height[left]`?
- [ ] Right process করলে কেন `rightMax - height[right]`?
- [ ] `totalWater += ...` কী করে?
- [ ] প্রতিটি bar-এর width কেন 1?
- [ ] Time ও space complexity কত?

**শেষ কথা:** Code মুখস্থ না করে এই reasoning মনে রাখো:

> ছোট পাশ process করো → সেই পাশের maximum update করো → current bar maximum-এর চেয়ে ছোট হলে জল যোগ করো → pointer move করো।
