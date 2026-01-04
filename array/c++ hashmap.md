| JavaScript Map  | C++ unordered_map                         |
| --------------- | ----------------------------------------- |
| `map.set(k,v)`  | `mp[k] = v`                               |
| `map.has(k)`    | `mp.find(k) != mp.end()`                  |
| `map.get(k)`    | `mp[k]` *(only after checking existence)* |
| `map.delete(k)` | `mp.erase(k)`                             |
| `map.size`      | `mp.size()`                               |


How do you KNOW this is HashMap / HashSet? 🧠
🔑 Keyword triggers in the problem statement

Whenever you see:

| Keyword                    | What it hints              |
| -------------------------- | -------------------------- |
| **unsorted array**         | Sorting costs `O(n log n)` |
| **consecutive / sequence** | Need fast lookup           |
| **longest / max**          | Track counts or streaks    |
| **distinct numbers**       | Set / Map works            |
| **expected O(n)**          | Hashing is likely          |


🚨 Big signal

“Find consecutive numbers WITHOUT sorting”

➡️ That immediately screams HashSet