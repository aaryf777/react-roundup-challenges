import { useParams } from "react-router-dom";
import ChallengePage from "@/components/challenge";

const ChallengePageContainer = () => {
  const { id } = useParams<{ id: string }>();

  // Mock challenge data - in a real app, this would come from an API
  const challenge = {
    id: "two-sum",
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    content: `
# Two Sum

Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly one solution***, and you may not use the *same* element twice.

You can return the answer in any order.

## Example 1:

\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

## Example 2:

\`\`\`
Input: nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

## Example 3:

\`\`\`
Input: nums = [3,3], target = 6
Output: [0,1]
\`\`\`

## Constraints:

- \`2 <= nums.length <= 104\`
- \`-109 <= nums[i] <= 109\`
- \`-109 <= target <= 109\`
- **Only one valid answer exists.**

## Follow-up:

Can you come up with an algorithm that is less than O(n²) time complexity?
`,
    hints: [
      "Try using a hash map to store visited numbers.",
      "Check if the complement exists before adding the current number.",
      "Aim for O(n) time complexity.",
    ],
    difficulty: "easy" as const,
    category: "arrays",
    timeEstimate: "15 min",
    solvedBy: 2547,
    points: 10,
    tags: ["Array", "Hash Table", "Two Pointers"],
    companies: ["Google", "Microsoft", "Meta"],
  };

  const initialCode = `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your solution here
    
};`;
  const functionName = "twoSum";
  const testCases = [
    {
      input: [[2, 7, 11, 15], 9],
      expected: [0, 1],
      description: "Basic case with solution",
    },
    {
      input: [[3, 2, 4], 6],
      expected: [1, 2],
      description: "Solution in middle of array",
    },
    {
      input: [[3, 3], 6],
      expected: [0, 1],
      description: "Same numbers",
    },
  ];

  const handleSubmitSolution = () => {
    // Handle solution submission
    console.log("Submitting solution...");
  };

  return (
    <ChallengePage
      challenge={challenge}
      initialCode={initialCode}
      functionName={functionName}
      testCases={testCases}
      onSubmitSolution={handleSubmitSolution}
    />
  );
};

export default ChallengePageContainer;
