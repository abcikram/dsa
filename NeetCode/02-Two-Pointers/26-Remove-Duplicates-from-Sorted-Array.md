# LeetCode 26 — Remove Duplicates from Sorted Array

**NeetCode category:** Two Pointers  
**Core technique:** Slow & Fast Pointers (Read & Write Pointers)  
**Difficulty:** Easy | **Language:** TypeScript  
**Problem:** https://leetcode.com/problems/remove-duplicates-from-sorted-array/

---

## 1. Problem Statement — সহজ বাংলায়

তোমাকে একটি **sorted integer array** `nums` দেওয়া থাকবে। Duplicate values in-place remove করতে হবে, যাতে প্রতিটি unique value একবার করে array-এর শুরুতে থাকে।

তোমার কাজ:
- Original array modify করতে হবে।
- প্রথম `k`টি position-এ sorted unique values রাখতে হবে।
- Unique elements-এর সংখ্যা `k` return করতে হবে।
- Extra space `O(1)` হতে হবে।
- `k`-এর পরের array values গুরুত্বপূর্ণ নয়।

Example:

```ts
nums = [0,0,1,1,1,2,2,3,3,4];

// k = 5
// First five positions: [0,1,2,3,4]
```

**Important:** শুধু unique count return করলে হবে না; original array-এর প্রথম `k` positions-এ unique values লিখতে হবে।

## 2. Pattern কী এবং কীভাবে চিনব?

<badge>Two Pointers</badge>

এই problem-এর pattern হলো **Slow & Fast Pointers**, যাকে Read & Write Pointers-ও বলা হয়।

Problem-এর clues:
1. Array sorted।
2. Duplicate remove করতে হবে।
3. In-place modification দরকার।
4. Extra space `O(1)` হতে হবে।

Sorted array-তে duplicate values পাশাপাশি থাকে। তাই Set/Map ছাড়াই current value-কে last unique value-এর সঙ্গে compare করতে পারি।

**Pattern shortcut:**

> Sorted Array + Remove Duplicates + In-place / O(1) extra space → Two Pointers (Read & Write).

## 3. তোমার Set Approach কেন যথেষ্ট নয়?

তোমার original logic unique count ঠিক বের করে:

```ts
const set = new Set<number>();
let count = 0;

for (const num of nums) {
  if (!set.has(num)) count++;
  set.add(num);
}
return count;
```

কিন্তু LeetCode 26-এর জন্য দুটি সমস্যা:
1. Original `nums` array-এর প্রথম `k` positions-এ unique values write করছে না।
2. Set input অনুযায়ী extra memory নেয়; worst-case space `O(n)`, অথচ problem চায় `O(1)`।

তাই unique count বের করতে Set ঠিক, কিন্তু in-place requirement-এর জন্য Two Pointers ব্যবহার করব।

## 4. Two Pointers Approach — মূল ধারণা

দুটি pointer রাখব:

- `slow`: unique section-এর শেষ index track করবে এবং next unique value কোথায় write হবে তা জানাবে।
- `fast`: পুরো array scan করে নতুন unique value খুঁজবে।

Initially:

```ts
let slow = 0;
```

প্রথম element-কে unique ধরে নিচ্ছি। তাই `fast` শুরু হবে index 1 থেকে।

প্রতিবার compare:

```ts
if (nums[fast] !== nums[slow]) {
  slow++;
  nums[slow] = nums[fast];
}
```

- Same হলে duplicate; কিছু write করব না।
- Different হলে নতুন unique value; `slow++` করে সেটি write করব।

**মনে রাখবে: `fast` খুঁজবে, `slow` লিখবে।**

## 5. Optimal TypeScript Solution

```ts
class Solution {
  removeDuplicates(nums: number[]): number {
    if (nums.length === 0) return 0;

    let slow = 0;

    for (let fast = 1; fast < nums.length; fast++) {
      // A new unique value is found.
      if (nums[fast] !== nums[slow]) {
        slow++;

        // Write it after the previous unique value.
        nums[slow] = nums[fast];
      }
    }

    // slow is an index; the count is index + 1.
    return slow + 1;
  }
}
```

## 6. Code Line by Line

### Empty array

```ts
if (nums.length === 0) return 0;
```

খালি array-তে কোনো unique value নেই।

### Initialize slow

```ts
let slow = 0;
```

প্রথম element-টি unique section-এর শুরু এবং আপাতত শেষ position।

### কেন fast = 1?

```ts
for (let fast = 1; fast < nums.length; fast++)
```

Index 0-কে আমরা already unique হিসেবে ধরে নিয়েছি, তাই পরের position থেকে scan করি।

যদি length 5 হয়, valid index: `0,1,2,3,4`। `fast < nums.length` হলে fast 1 থেকে শেষ index `4` পর্যন্ত যাবে।

### Compare

```ts
if (nums[fast] !== nums[slow])
```

Sorted array-তে fast value যদি last unique value থেকে আলাদা হয়, তবে নতুন unique value পেয়েছি।

### Move and write

```ts
slow++;
nums[slow] = nums[fast];
```

প্রথমে next write position-এ যাই, তারপর নতুন unique value সেখানে বসাই।

### কেন slow + 1 return?

```ts
return slow + 1;
```

`slow` একটি index, count নয়। যদি `slow = 3`, তাহলে unique indices 0,1,2,3 — মোট 4টি element। তাই count = index + 1।

## 7. Full Dry Run — [1, 1, 2, 3, 4]

Input:

```ts
nums = [1, 1, 2, 3, 4];
slow = 0;
```

### Initially

```text
Index:  0  1  2  3  4
Value:  1  1  2  3  4
        ^
       slow
```

### fast = 1

```ts
nums[1] === nums[0]; // 1 === 1
```

Same, skip। Array unchanged, `slow = 0`।

### fast = 2

```ts
nums[2] !== nums[0]; // 2 !== 1
slow++;              // slow = 1
nums[1] = nums[2];   // write 2
```

Array: `[1, 2, 2, 3, 4]`, `slow = 1`।

### fast = 3

```ts
nums[3] !== nums[1]; // 3 !== 2
slow++;              // slow = 2
nums[2] = nums[3];   // write 3
```

Array: `[1, 2, 3, 3, 4]`, `slow = 2`।

### fast = 4

```ts
nums[4] !== nums[2]; // 4 !== 3
slow++;              // slow = 3
nums[3] = nums[4];   // write 4
```

Array: `[1, 2, 3, 4, 4]`, `slow = 3`।

### Dry-run table

| Fast | nums[fast] | Slow before | nums[slow] before | Action | Array after action | Slow after |
|---:|---:|---:|---:|---|---|---:|
| 1 | 1 | 0 | 1 | Same, skip | `[1,1,2,3,4]` | 0 |
| 2 | 2 | 0 | 1 | Write 2 | `[1,2,2,3,4]` | 1 |
| 3 | 3 | 1 | 2 | Write 3 | `[1,2,3,3,4]` | 2 |
| 4 | 4 | 2 | 3 | Write 4 | `[1,2,3,4,4]` | 3 |

Final:

```ts
slow = 3;
return slow + 1; // 4
```

**Output: 4**

প্রথম 4টি position-এ unique values: `[1,2,3,4]`।

### Tail values কেন ignore করা যায়?

Final array `[1,2,3,4,4]` হলেও problem শুধু প্রথম `k=4` positions পরীক্ষা করে। `k`-এর পরের values কী আছে, তা গুরুত্বপূর্ণ নয়।

## 8. Another Example — All Same Values

```ts
nums = [2, 2, 2, 2];
```

- `slow = 0`
- fast = 1,2,3
- প্রতিবার `nums[fast] === nums[slow]`
- কোনো নতুন unique value নেই
- slow move করে না

Return `slow + 1 = 1`।

## 9. Edge Cases

| Input | Output | Reason |
|---|---:|---|
| `[]` | 0 | Empty array |
| `[1]` | 1 | Single element |
| `[1,1,1,1]` | 1 | All values same |
| `[1,2,3,4]` | 4 | All values unique |
| `[1,1,2]` | 2 | Unique: 1, 2 |
| `[1,1,2,2,3]` | 3 | Unique: 1, 2, 3 |
| `[-3,-3,-1,0,0,2]` | 4 | Unique: -3, -1, 0, 2 |

## 10. Common Mistakes

1. **Set দিয়ে শুধু count return করা:** original array-এর first k positions modify হয় না; extra space-ও লাগে।
2. **Sorted property ভুলে যাওয়া:** sorted array-তে duplicate পাশাপাশি থাকে।
3. **fast index 0 থেকে শুরু করা:** slow=0 দিয়ে first element already unique ধরে নিয়েছি; fast=1 থেকে শুরু।
4. **slow-কে count ভাবা:** slow হলো index, count নয়; তাই `slow + 1`।
5. **Write করার আগে slow increment না করা:** correct order `slow++`, তারপর `nums[slow] = nums[fast]`।
6. **শেষ index skip করা:** `fast < nums.length` ব্যবহার করো, `fast < nums.length - 1` নয়।
7. **পুরো tail পরিষ্কার হবে ধরে নেওয়া:** শুধু first k values গুরুত্বপূর্ণ।

## 11. Time & Space Complexity

Let `n = nums.length`।

### Time: O(n)

- fast pointer index 1 থেকে n-1 পর্যন্ত যায়।
- প্রতিটি element একবার compare হয়।
- unique value পেলে constant-time write হয়।

```text
Time Complexity = O(n)
```

### Auxiliary Space: O(1)

শুধু slow ও fast-এর মতো fixed number of variables লাগে। Extra Set বা array নেই।

```text
Auxiliary Space = O(1)
```

### Set vs Two Pointers

| Approach | Time | Auxiliary Space | In-place? |
|---|---:|---:|---|
| Set (initial approach) | O(n) | O(n) | No |
| Two Pointers | O(n) | O(1) | Yes |

## 12. Interview-এ Approach কীভাবে চিনবে?

নিজেকে প্রশ্ন করবে:

1. Array sorted? — হ্যাঁ।
2. Duplicate values পাশাপাশি? — হ্যাঁ।
3. Original array-তেই unique values রাখতে হবে? — হ্যাঁ।
4. Extra space O(1) দরকার? — হ্যাঁ।

তাই Two Pointers — Read & Write ব্যবহার করব।

### Interview-ready explanation

> Since the array is sorted, duplicate values are adjacent. I use two pointers: fast scans the array, while slow marks the end of the unique section. Whenever nums[fast] differs from nums[slow], I move slow forward and write the new unique value at that position. At the end, slow + 1 is the number of unique elements. This modifies the input in place with O(n) time and O(1) auxiliary space.

## 13. Related Two Pointers Practice

| Problem | Main technique |
|---|---|
| 26. Remove Duplicates from Sorted Array | Slow & Fast / Read & Write |
| 27. Remove Element | Slow & Fast / In-place overwrite |
| 80. Remove Duplicates from Sorted Array II | Slow & Fast with occurrence limit |
| 283. Move Zeroes | Slow & Fast / In-place overwrite |
| 125. Valid Palindrome | Two Pointers from both ends |
| 167. Two Sum II — Input Array Is Sorted | Two Pointers from both ends |

## 14. Final Revision Checklist

- [ ] In-place requirement বুঝি।
- [ ] কেন sorted array-তে duplicate পাশাপাশি থাকে, explain করতে পারি।
- [ ] কেন এটি Two Pointers pattern?
- [ ] slow ও fast-এর কাজ আলাদা করে বলতে পারি।
- [ ] fast কেন index 1 থেকে শুরু হয়?
- [ ] `nums[fast] !== nums[slow]` কেন check করি?
- [ ] slow++ করে তারপর write করি কেন?
- [ ] slow index, count নয় — বুঝি।
- [ ] কেন slow + 1 return করি?
- [ ] [1,1,2,3,4] dry run করতে পারি।
- [ ] Time O(n), auxiliary space O(1) explain করতে পারি।
- [ ] Set approach কেন in-place requirement পূরণ করে না, বলতে পারি।

### One-line Memory Trick

> fast নতুন unique value খুঁজবে → slow এক ঘর সামনে যাবে → nums[slow] = nums[fast] দিয়ে write করবে → শেষে slow + 1 return করবে।
