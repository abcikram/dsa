# Flatten Nested Array

## Simple Solution — TypeScript

```ts
function flattenArray(arr: any[]): any[] {
  const result: any[] = [];

  for (const element of arr) {
    if (Array.isArray(element)) {
      result.push(...flattenArray(element));
    } else {
      result.push(element);
    }
  }

  return result;
}

const arr = [1, [2, 3], [4, [5, 6]]];
console.log(flattenArray(arr)); // [1, 2, 3, 4, 5, 6]
```

## Explanation

- Element array হলে recursive call করে তার ভেতরের values flatten করি।
- Element array না হলে সরাসরি `result`-এ push করি।
- সব element শেষ হলে flattened result return করি।

## Complexity

ধরি, nested arrays মিলিয়ে মোট element সংখ্যা (N) এবং maximum nesting depth (D)।

- **Time:** (O(N)) — প্রতিটি element একবার visit হয়।
- **Extra space:** (O(D)) recursion stack, output array বাদে।

## Built-in Alternative

```ts
const result = arr.flat(Infinity);
```
