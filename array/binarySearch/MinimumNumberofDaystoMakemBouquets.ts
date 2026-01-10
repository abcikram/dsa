function minDays(bloomDay: number[], m: number, k: number): number {
  let start = Math.min(...bloomDay);
  let end = Math.max(...bloomDay);

  //edge case

  if (bloomDay.length < m * k) return -1;

  let minDay = -1;
  let mid: number;

  // binary search
  while (start <= end) {
    mid = Math.floor(start + (end - start) / 2);

    // if minimum number of bloom days if greter or equal boqunets
    // then try to minimise so go to left
    if (numberOfMakeBouquets(bloomDay, mid, k) >= m) {
      minDay = mid;
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }
  return minDay;
}

function numberOfMakeBouquets(bloomDay: number[], day: number, k: number) {
  let flower = 0;
  let bouquets = 0;

  for (let i = 0; i < bloomDay.length; i++) {
    if (bloomDay[i] <= day) {
      flower = flower + 1;
      if (flower == k) {
        bouquets++;
        flower = 0;
      }
    } else {
      flower = 0;
    }
  }

  return bouquets;
}

//Time: O(n log maxDay)

// Space: O(1)



Minimum Days to Make m Bouquets
🧠 Core Idea
Answer = minimum day
Monotonic → Binary Search


If bouquets can be made on day D

Then they can be made on any day > D
➡️ Binary Search on Days

❗ Feasibility Check
if (m * k > total flowers)
    return -1


➡️ Not enough flowers → impossible

🎯 Search Space
start = min(bloomDay)   // earliest bloom
end   = max(bloomDay)   // all bloomed


➡️ Answer must lie in this range

🔁 Binary Search Loop
while (start <= end)
    mid = (start + end) / 2

Decision:
if (canMake(mid))
    answer = mid
    end = mid - 1   // minimize days
else
    start = mid + 1 // need more days

🧩 Helper: canMakeBouquets(day)
Variables
bouquets = 0     // total bouquets formed
flowers  = 0     // consecutive bloomed flowers

Traversal Logic
for each flower:
    if bloomDay[i] <= day:
        flowers++
        if flowers == k:
            bouquets++
            flowers = 0
    else:
        flowers = 0   // break adjacency

Final Check
return bouquets >= m

🧠 Greedy Insight
Only consecutive bloomed flowers count
Non-bloomed flower breaks chain

⏱️ Complexity
Time:  O(n log maxDay)
Space: O(1)

✅ One-Line Exam / Interview Answer
Binary search on minimum day + greedy counting of
consecutive bloomed flowers to form bouquets