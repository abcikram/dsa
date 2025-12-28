function subarraySum(nums: number[], k: number): number {
  const mpp = new Map<number, number>();

  mpp.set(0, 1);

  let preSum = 0;
  let count = 0;

  for (const num of nums) {
    preSum += num;

    const remove = preSum - k;

    if (mpp.has(remove)) {
      count += mpp.get(remove)!;
    }

    mpp.set(preSum, (mpp.get(preSum) ?? 0) + 1);
  }

  return count;
}


// in c++// int subarraySum(vector<int>& nums, int k)


class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
      map<int, int>mpp;
      int currSum = 0, count =0;
      mpp[0] = 1;
      //{0:1}
      for(int i=0;i<nums.size();i++){
        currSum += nums[i];
        int need = currSum - k;
        count += mpp[need];
        mpp[currSum] += 1;
      }

      return count;
    }
};