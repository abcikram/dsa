# Flatten Nested Array — Recursion

## Problem / Goal

একটি nested array দেওয়া থাকবে। Nested array মানে array-এর ভেতরে আবার array থাকতে পারে। আমাদের কাজ হলো সব nested level খুলে values-গুলোকে একটি **normal one-dimensional array**-তে রাখা।

Example:

```ts
const arr = [1, [2, 3], [4, [5, 6]]];

// Expected:
[1, 2, 3, 4, 5, 6]
```

এটি NeetCode 150-এর নির্দিষ্ট numbered problem নয়; এটি Array Traversal + Recursion-এর একটি foundational DSA pattern।

## Pattern Recognition

যখন কোনো array-এর element নিজেও array হতে পারে এবং nesting-এর depth আগে থেকে জানা নেই, তখন **Recursion / DFS** ভাববে।

- Primary category: Arrays & Hashing
- Secondary pattern: Recursion (Depth-First Traversal)
- Core idea: প্রতিটি element দেখো। Element array হলে তার ভেতরে recursion করো; primitive/value হলে result-এ যোগ করো।

## Approach 1 — Built-in `flat(Infinity)`

JavaScript-এর built-in method:

```ts
const arr = [1, [2, 3], [4, [5, 6]]];

const result = arr.flat(Infinity);

console.log(result); // [1, 2, 3, 4, 5, 6]
```

- `flat()` nested array-এর level খুলে দেয়।
- Default depth হলো `1`; তাই সব level flatten করতে `Infinity` দাও।
- বাস্তব JavaScript কাজের জন্য এটি সবচেয়ে সহজ solution।

Interview-এ recursion implement করতে বললে built-in method-এর বদলে নিচের approach explain করবে।

## Approach 2 — Recursion (Recommended for DSA Practice)

### TypeScript solution

```ts
class Solution {
  flattenArray(arr: unknown[]): unknown[] {
    const result: unknown[] = [];

    const dfs = (current: unknown[]): void => {
      for (const element of current) {
        if (Array.isArray(element)) {
          dfs(element);
        } else {
          result.push(element);
        }
      }
    };

    dfs(arr);
    return result;
  }
}
```

### Line-by-line explanation

1. `result` হলো final one-dimensional array। সব value এখানে জমা হবে।
2. `dfs(current)` বর্তমান array-এর প্রতিটি element visit করে।
3. `for...of` দিয়ে current array-এর element একে একে পড়ি।
4. `Array.isArray(element)` check করে element নিজেই array কি না।
5. Array হলে `dfs(element)` call করি। এটাই recursion: একই কাজ nested array-এর ওপর আবার করা।
6. Array না হলে `result.push(element)` করি, কারণ value-টি final output-এ সরাসরি যাবে।
7. শেষে outer array-এর জন্য `dfs(arr)` call করে `result` return করি।

### Dry run

Input:

```ts
[1, [2, 3], [4, [5, 6]]]
```

| Step | Current element | Action | Result |
|---:|---|---|---|
| 1 | `1` | Array নয়, push | `[1]` |
| 2 | `[2, 3]` | Array, recursion call | `[1]` |
| 3 | `2` | Array নয়, push | `[1, 2]` |
| 4 | `3` | Array নয়, push | `[1, 2, 3]` |
| 5 | `[4, [5, 6]]` | Array, recursion call | `[1, 2, 3]` |
| 6 | `4` | Array নয়, push | `[1, 2, 3, 4]` |
| 7 | `[5, 6]` | আবার recursion call | `[1, 2, 3, 4]` |
| 8 | `5`, তারপর `6` | দুটোই push | `[1, 2, 3, 4, 5, 6]` |

প্রতিটি recursive call শেষ হলে control আগের call-এ ফিরে আসে। সব call শেষ হলে final result পাওয়া যায়।

### Recursion-এর mental model

প্রতিটি level-এ একই প্রশ্ন:

- Element কি array? **হ্যাঁ:** তার ভেতরে ঢোকো (recursive call)।
- Element কি array? **না:** result-এ যোগ করো।

Nesting কত level গভীর, তা আগে থেকে জানার প্রয়োজন নেই।

## Approach 3 — Iterative (Explicit Stack)

খুব গভীর nesting হলে recursion call-stack limit ছাড়িয়ে যেতে পারে। তখন নিজের stack ব্যবহার করা যায়।

```ts
function flattenArrayIterative(arr: unknown[]): unknown[] {
  const result: unknown[] = [];
  const stack: unknown[] = [...arr].reverse();

  while (stack.length > 0) {
    const current = stack.pop();

    if (Array.isArray(current)) {
      for (let i = current.length - 1; i >= 0; i--) {
        stack.push(current[i]);
      }
    } else {
      result.push(current);
    }
  }

  return result;
}
```

**কেন reverse করছি?** Stack হলো LIFO। শুরুতে array reverse করে রাখি, তারপর nested array-এর element-গুলোও reverse order-এ push করি। এতে pop করার সময় original left-to-right order বজায় থাকে।

## Complexity Analysis

ধরি:

- (E) = সব nested array মিলিয়ে মোট element entry-এর সংখ্যা (primitive value এবং nested-array reference দুটোই)
- (N) = final output-এ থাকা value-এর সংখ্যা
- (D) = maximum nesting depth

| Approach | Time | Extra space |
|---|---:|---:|
| Built-in `flat(Infinity)` | (O(E)) | (O(N)) output |
| Recursive DFS | (O(E)) | (O(D)) call stack + (O(N)) output |
| Iterative stack | (O(E)) | Up to (O(E)) explicit stack + (O(N)) output |

প্রতিটি entry একবার process হয়, তাই traversal time (O(E))। Output array-এর memory আলাদা করে ধরতে হবে।

## Edge Cases

```ts
flattenArray([]);               // []
flattenArray([1, 2, 3]);        // [1, 2, 3]
flattenArray([[], [1, []]]);    // [1]
flattenArray([[1, 2], [3, 4]]); // [1, 2, 3, 4]
flattenArray([1, [2, [3]]]);    // [1, 2, 3]
```

এখানে ধরে নেওয়া হয়েছে array-গুলোতে circular reference নেই। কোনো array যদি নিজেকেই contain করে, simple recursion থামবে না; সে ক্ষেত্রে visited-set দিয়ে cycle handling প্রয়োজন।

## Common Mistakes

1. **শুধু এক level flatten করা:** `flat()` default depth 1। সব level-এর জন্য `flat(Infinity)` লাগবে।
2. **Nested array-কে সরাসরি push করা:** `result.push(element)` শুধু array element-এর ক্ষেত্রে করলে nested array থেকেই যাবে। Array হলে recursion করতে হবে।
3. **Recursive call-এর result ignore করা:** এই implementation shared `result` accumulator ব্যবহার করে, তাই recursive call-এর return value push করার দরকার নেই।
4. **Order উল্টে ফেলা:** Iterative stack ব্যবহার করলে reverse order-এ push করতে হবে।
5. **খুব deep nesting উপেক্ষা করা:** Recursive approach-এর call stack সীমা আছে; extreme depth-এর জন্য iterative stack বিবেচনা করবে।

## Interview Explanation

“I will traverse every element of the input array. If an element is itself an array, I recursively traverse that nested array. Otherwise, I append the value to a shared result array. This is a depth-first traversal, and every element is processed once.”

## Revision Checklist

- [ ] Nested array আর one-dimensional array-এর পার্থক্য বুঝি।
- [ ] `Array.isArray()` দিয়ে nested array detect করতে পারি।
- [ ] Array হলে recursion, value হলে push — এই rule মনে আছে।
- [ ] Recursive DFS-এর dry run করতে পারি।
- [ ] `flat(Infinity)` এবং iterative stack approach চিনি।
- [ ] Time (O(E)), recursive call stack (O(D)), output (O(N)) বুঝি।
