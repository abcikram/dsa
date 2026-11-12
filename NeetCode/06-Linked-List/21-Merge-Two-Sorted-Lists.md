# 21 — Merge Two Sorted Lists

## Pattern

**Linked List + Recursion**

Given two sorted linked lists, merge them into one sorted linked list and return its head.

Example:

```text
list1 = 1 → 2 → 4
list2 = 1 → 3 → 5

Output = 1 → 1 → 2 → 3 → 4 → 5
```

## Recursive Approach (CodeWithMIK-style)

### TypeScript Solution

LeetCode provides the `ListNode` definition.

```ts
class Solution {
  mergeTwoLists(
    list1: ListNode | null,
    list2: ListNode | null
  ): ListNode | null {

    // Base cases
    if (list1 === null) return list2;
    if (list2 === null) return list1;

    let result: ListNode;

    if (list1.val < list2.val) {
      result = list1;
      result.next = this.mergeTwoLists(list1.next, list2);
    } else {
      result = list2;
      result.next = this.mergeTwoLists(list1, list2.next);
    }

    return result;
  }
}
```

## Understand the Core Logic

There are only two decisions:

1. Compare the two current head values.
2. Select the smaller node, then recursively merge the remaining nodes and connect the returned list to `result.next`.

- `result = list1`: choose the current node from list1.
- `result.next = this.mergeTwoLists(...)`: ask recursion to merge what remains, then connect that returned head after the chosen node.
- The `else` branch does the same thing with list2. Equal values go through `else` because the condition uses `<`.

**Important:** The recursive call on the right-hand side must finish and return a node before the `result.next = ...` assignment is completed. That is why the links are connected while recursion returns.

## Base Cases

```ts
if (list1 === null) return list2;
if (list2 === null) return list1;
```

When one list becomes empty, the other list is already sorted. Return the remaining list directly; there is no need to visit or rebuild its nodes.

## Full Dry Run

Input:

```text
list1 = 1a → 2 → 4 → null
list2 = 1b → 3 → 5 → null
```

The labels `1a` and `1b` only distinguish the two nodes whose values are both `1`. The final output values are still `1 → 1 → 2 → 3 → 4 → 5`.

### Phase 1 — Recursive calls (going down)

| Call | Compare | Selected node | Next recursive call |
|---:|---|---|---|
| 1 | `1a < 1b` is false | `1b` from list2 | `merge(1a, 3)` |
| 2 | `1a < 3` | `1a` from list1 | `merge(2, 3)` |
| 3 | `2 < 3` | `2` from list1 | `merge(4, 3)` |
| 4 | `4 < 3` is false | `3` from list2 | `merge(4, 5)` |
| 5 | `4 < 5` | `4` from list1 | `merge(null, 5)` |
| 6 | list1 is null | Base case | Return `5 → null` |

Call stack shape:

```text
merge(1a, 1b)   select 1b
    |
    v
merge(1a, 3)    select 1a
    |
    v
merge(2, 3)     select 2
    |
    v
merge(4, 3)     select 3
    |
    v
merge(4, 5)     select 4
    |
    v
merge(null, 5)  BASE CASE: return 5
```

At this point, no selected node has its final `next` link assigned by these recursive calls yet. Each call is waiting for the deeper call to return.

### Phase 2 — Recursive returns (coming back up)

Now the base case returns node `5`. Each waiting call connects its selected node to the list returned by the deeper call.

| Returning to call | Assignment completed | List returned by this call |
|---:|---|---|
| 5 | `node4.next = node5` | `4 → 5` |
| 4 | `node3.next = node4` | `3 → 4 → 5` |
| 3 | `node2.next = node3` | `2 → 3 → 4 → 5` |
| 2 | `node1a.next = node2` | `1a → 2 → 3 → 4 → 5` |
| 1 | `node1b.next = node1a` | `1b → 1a → 2 → 3 → 4 → 5` |

Return flow:

```text
BASE CASE returns:       5
                          ↑
Call 5 connects:         4 → 5
                          ↑
Call 4 connects:         3 → 4 → 5
                          ↑
Call 3 connects:         2 → 3 → 4 → 5
                          ↑
Call 2 connects:         1a → 2 → 3 → 4 → 5
                          ↑
Call 1 connects:         1b → 1a → 2 → 3 → 4 → 5
```

Final values:

```text
1 → 1 → 2 → 3 → 4 → 5 → null
```

## Why Does `result.next` Connect During Return?

Take this line:

```ts
result.next = this.mergeTwoLists(list1.next, list2);
```

For example, in call 3, `result` is node `2`.

1. The function calls `mergeTwoLists(4, 3)`.
2. That call and all deeper calls finish first.
3. The deeper call eventually returns the head of `3 → 4 → 5`.
4. Only then does the assignment complete: `node2.next = returnedHead`.
5. This call returns node `2` as the head of `2 → 3 → 4 → 5`.

So recursion goes **down to the base case**, then connects the nodes while **returning up**.

## What Does Console Output Look Like?

LeetCode returns a linked-list head. Logging it directly usually shows nested `ListNode` objects (the exact formatting depends on the runtime).

```ts
const mergedHead = solution.mergeTwoLists(list1, list2);

const output: number[] = [];
let current = mergedHead;

while (current !== null) {
  output.push(current.val);
  current = current.next;
}

console.log(output);
// [1, 1, 2, 3, 4, 5]
```

## Complexity

Let `m` be the number of nodes in list1 and `n` be the number of nodes in list2.

- **Time:** `O(m + n)` — each node is selected and processed once.
- **Auxiliary space:** `O(m + n)` — recursive call stack in the worst case.
- **New list nodes:** `O(1)` — existing nodes are re-linked; no new data nodes are created.

## Common Mistakes

1. **Forgetting the base case:** recursion would continue after one list is empty.
2. **Returning `result.next` instead of `result`:** the current selected node is the head of this call's merged list, so return `result`.
3. **Thinking `result.next` is assigned before recursion runs:** the recursive call must return before the assignment gets its returned node.
4. **Creating new nodes unnecessarily:** this approach reuses the input nodes and changes their `next` pointers.

## Interview Explanation

“I compare the two current head nodes and select the smaller one. Then I recursively merge the remaining part of that list with the other list, and attach the returned head to the selected node. If either list becomes null, I return the other list because it is already sorted.”

## Quick Revision

- [ ] Compare current head values.
- [ ] Select the smaller node.
- [ ] Recursively merge the remaining lists.
- [ ] Attach the recursive result to `result.next`.
- [ ] Return `result`.
- [ ] When one list is null, return the other list.
