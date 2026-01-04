class Solution
{
public:
    vector<vector<int>> threeSum(vector<int> &nums)
    {

        vector<vector<int>> ans;
        int n = nums.size();

        // sort
        sort(nums.begin(), nums.end());
        for (int i = 0; i < n; i++)
        {
            // skip duplicate for i
            if (i > 0 && nums[i] == nums[i - 1])
                continue;

            // fixed one and remaning tow using two pointer
            int j = i + 1;
            int k = n - 1;

            while (j < k)
            {
                int sum = nums[i] + nums[j] + nums[k];

                if (sum < 0)
                    j++;
                else if (sum > 0)
                    k--;
                else
                {
                    // sum == 0;
                    vector<int> temp = {nums[i], nums[j], nums[k]};
                    ans.push_back(temp);
                    j++;
                    k--;

                    // skip duplicate for j and k
                    while (j < k && nums[j] == nums[j - 1])
                        j++;
                    while (j < k && nums[k] == nums[k + 1])
                        k--;
                }
            }
        }

        return ans;
    }

};