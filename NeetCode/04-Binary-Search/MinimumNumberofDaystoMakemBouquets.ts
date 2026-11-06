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



function minDays(bloomDay: number[], m: number, k: number): number {
  let start = Math.min(...bloomDay); // সবচেয়ে কম দিন, এর আগে কোনো ফুল ফুটে না
  let end = Math.max(...bloomDay); // সবচেয়ে বেশি দিন, এই দিনে সব ফুল ফুটে যায়

  // edge case: ফুল কম হলে bouquet বানানো সম্ভব নয়
  if (bloomDay.length < m * k) return -1;

  let minDay = -1; // এখন পর্যন্ত পাওয়া সর্বনিম্ন valid দিন
  let mid: number; // binary search-এর মাঝের দিন

  // দিনের ওপর binary search
  while (start <= end) {
    mid = Math.floor(start + (end - start) / 2); // মাঝের দিন বের করা

    // যদি mid দিনে m বা তার বেশি bouquet বানানো যায়
    // তাহলে mid valid, তাই কম দিন খুঁজতে বামে যাব
    if (numberOfMakeBouquets(bloomDay, mid, k) >= m) {
      minDay = mid; // বর্তমান দিনকে উত্তর হিসেবে রাখি
      end = mid - 1; // আরও কম দিন খোঁজার চেষ্টা
    } else {
      start = mid + 1; // বেশি দিন দরকার, ডানে যাই
    }
  }

  return minDay; // সর্বনিম্ন দিন ফেরত
}

function numberOfMakeBouquets(bloomDay: number[], day: number, k: number) {
  let flower = 0; // টানা কতগুলো ফুল ফুটেছে
  let bouquets = 0; // মোট bouquet সংখ্যা

  // সব ফুল একে একে চেক করা
  for (let i = 0; i < bloomDay.length; i++) {
    if (bloomDay[i] <= day) {
      // ফুলটা day দিনের মধ্যে ফুটেছে
      flower++; // consecutive ফুলের সংখ্যা বাড়াও

      if (flower === k) {
        // k টা টানা ফুল পাওয়া গেলে
        bouquets++; // একটি bouquet তৈরি
        flower = 0; // পরের bouquet-এর জন্য reset
      }
    } else {
      flower = 0; // ফুল না ফুটলে adjacency ভেঙে যায়
    }
  }

  return bouquets; // মোট কয়টা bouquet বানানো গেছে
}
