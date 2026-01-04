function fourSumCount(
  nums1: number[],
  nums2: number[],
  nums3: number[],
  nums4: number[]
): number {
  let map = new Map<number, number>();
  for (let i = 0; i < nums1.length; i++) {
    for (let j = 0; j < nums2.length; j++) {
      let sum = nums1[i] + nums2[j];
      map.set(sum, (map.get(sum) || 0) + 1);
    }
  }

  let count = 0;

  for (let i = 0; i < nums3.length; i++) {
    for (let j = 0; j < nums4.length; j++) {
      let total = -(nums3[i] + nums4[j]);
      if (map.get(total)) {
        count = count + (map.get(total) || 1);
      }
    }
  }

  return count;
}

Note:-

a + b + c + d = 0;

a+b = -(c+d)