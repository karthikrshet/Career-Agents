import { NextRequest, NextResponse } from "next/server";
import { STARTER_TEMPLATES } from "../../../../../../../../packages/coding-engine";

export const dynamic = "force-dynamic";

const COMPLIANT_PROBLEM_DETAILS: Record<string, any> = {
  "two-sum": {
    id: "1",
    frontendQuestionId: "1",
    title: "Two Sum",
    titleSlug: "two-sum",
    content: `<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
<p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the <em>same</em> element twice.</p>
<p>You can return the answer in any order.</p>

<p><strong class="example font-bold">Example 1:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> nums = [2,7,11,15], target = 9
<strong>Output:</strong> [0,1]
<strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</pre>

<p><strong class="example font-bold">Example 2:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> nums = [3,2,4], target = 6
<strong>Output:</strong> [1,2]</pre>

<p><strong class="example font-bold">Example 3:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> nums = [3,3], target = 6
<strong>Output:</strong> [0,1]</pre>

<p><strong>Constraints:</strong></p>
<ul class="list-disc pl-5 font-mono space-y-1">
	<li><code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
	<li><code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code></li>
	<li><strong>Only one valid answer exists.</strong></li>
</ul>`,
    difficulty: "Easy",
    likes: 54100,
    dislikes: 1820,
    topicTags: [{ name: "Array", slug: "array" }, { name: "Hash Table", slug: "hash-table" }],
    companies: ["Google", "Amazon", "Meta", "Microsoft", "Apple"],
    hints: [
      "A brute force approach checks all possible pairs of numbers, taking O(n^2) time. Can we do better?",
      "Use a hash map to store previously seen numbers and their indices for O(1) lookups."
    ],
    sampleTestCase: "[2,7,11,15]\n9",
    starterTemplates: STARTER_TEMPLATES
  },
  "add-two-numbers": {
    id: "2",
    frontendQuestionId: "2",
    title: "Add Two Numbers",
    titleSlug: "add-two-numbers",
    content: `<p>You are given two <strong>non-empty</strong> linked lists representing two non-negative integers. The digits are stored in <strong>reverse order</strong>, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.</p>
<p>You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>

<p><strong class="example font-bold">Example 1:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> l1 = [2,4,3], l2 = [5,6,4]
<strong>Output:</strong> [7,0,8]
<strong>Explanation:</strong> 342 + 465 = 807.</pre>

<p><strong class="example font-bold">Example 2:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> l1 = [0], l2 = [0]
<strong>Output:</strong> [0]</pre>

<p><strong>Constraints:</strong></p>
<ul class="list-disc pl-5 font-mono space-y-1">
	<li>The number of nodes in each linked list is in the range <code>[1, 100]</code>.</li>
	<li><code>0 &lt;= Node.val &lt;= 9</code></li>
	<li>It is guaranteed that the list represents a number that does not have leading zeros.</li>
</ul>`,
    difficulty: "Medium",
    likes: 31200,
    dislikes: 6100,
    topicTags: [{ name: "Linked List", slug: "linked-list" }, { name: "Math", slug: "math" }, { name: "Recursion", slug: "recursion" }],
    companies: ["Amazon", "Microsoft", "Meta", "Bloomberg"],
    hints: ["Keep track of the carry using a variable and simulate digit-by-digit addition."],
    sampleTestCase: "[2,4,3]\n[5,6,4]",
    starterTemplates: STARTER_TEMPLATES
  },
  "longest-substring-without-repeating-characters": {
    id: "3",
    frontendQuestionId: "3",
    title: "Longest Substring Without Repeating Characters",
    titleSlug: "longest-substring-without-repeating-characters",
    content: `<p>Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.</p>

<p><strong class="example font-bold">Example 1:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> s = "abcabcbb"
<strong>Output:</strong> 3
<strong>Explanation:</strong> The answer is "abc", with the length of 3.</pre>

<p><strong class="example font-bold">Example 2:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> s = "bbbbb"
<strong>Output:</strong> 1
<strong>Explanation:</strong> The answer is "b", with the length of 1.</pre>

<p><strong class="example font-bold">Example 3:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> s = "pwwkew"
<strong>Output:</strong> 3
<strong>Explanation:</strong> The answer is "wke", with the length of 3.</pre>

<p><strong>Constraints:</strong></p>
<ul class="list-disc pl-5 font-mono space-y-1">
	<li><code>0 &lt;= s.length &lt;= 5 * 10<sup>4</sup></code></li>
	<li><code>s</code> consists of English letters, digits, symbols and spaces.</li>
</ul>`,
    difficulty: "Medium",
    likes: 39500,
    dislikes: 1840,
    topicTags: [{ name: "Hash Table", slug: "hash-table" }, { name: "String", slug: "string" }, { name: "Sliding Window", slug: "sliding-window" }],
    companies: ["Google", "Meta", "Amazon", "OpenAI"],
    hints: ["Use a sliding window with two pointers and a hash set/map to maintain non-duplicate characters."],
    sampleTestCase: "\"abcabcbb\"",
    starterTemplates: STARTER_TEMPLATES
  },
  "median-of-two-sorted-arrays": {
    id: "4",
    frontendQuestionId: "4",
    title: "Median of Two Sorted Arrays",
    titleSlug: "median-of-two-sorted-arrays",
    content: `<p>Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return <strong>the median</strong> of the two sorted arrays.</p>
<p>The overall run time complexity should be <code>O(log (m+n))</code>.</p>

<p><strong class="example font-bold">Example 1:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> nums1 = [1,3], nums2 = [2]
<strong>Output:</strong> 2.00000
<strong>Explanation:</strong> merged array = [1,2,3] and median is 2.</pre>

<p><strong class="example font-bold">Example 2:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> nums1 = [1,2], nums2 = [3,4]
<strong>Output:</strong> 2.50000
<strong>Explanation:</strong> merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.</pre>

<p><strong>Constraints:</strong></p>
<ul class="list-disc pl-5 font-mono space-y-1">
	<li><code>nums1.length == m</code></li>
	<li><code>nums2.length == n</code></li>
	<li><code>0 &lt;= m, n &lt;= 1000</code></li>
	<li><code>1 &lt;= m + n &lt;= 2000</code></li>
	<li><code>-10<sup>6</sup> &lt;= nums1[i], nums2[i] &lt;= 10<sup>6</sup></code></li>
</ul>`,
    difficulty: "Hard",
    likes: 27800,
    dislikes: 3100,
    topicTags: [{ name: "Array", slug: "array" }, { name: "Binary Search", slug: "binary-search" }, { name: "Divide and Conquer", slug: "divide-and-conquer" }],
    companies: ["Google", "Amazon", "Databricks", "Snowflake"],
    hints: ["Binary search on the smaller array to partition both arrays into left and right halves with equal elements."],
    sampleTestCase: "[1,3]\n[2]",
    starterTemplates: STARTER_TEMPLATES
  },
  "longest-palindromic-substring": {
    id: "5",
    frontendQuestionId: "5",
    title: "Longest Palindromic Substring",
    titleSlug: "longest-palindromic-substring",
    content: `<p>Given a string <code>s</code>, return <em>the longest palindromic substring</em> in <code>s</code>.</p>

<p><strong class="example font-bold">Example 1:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> s = "babad"
<strong>Output:</strong> "bab"
<strong>Explanation:</strong> "aba" is also a valid answer.</pre>

<p><strong class="example font-bold">Example 2:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> s = "cbbd"
<strong>Output:</strong> "bb"</pre>

<p><strong>Constraints:</strong></p>
<ul class="list-disc pl-5 font-mono space-y-1">
	<li><code>1 &lt;= s.length &lt;= 1000</code></li>
	<li><code>s</code> consists of only digits and English letters.</li>
</ul>`,
    difficulty: "Medium",
    likes: 29100,
    dislikes: 1720,
    topicTags: [{ name: "Two Pointers", slug: "two-pointers" }, { name: "String", slug: "string" }, { name: "Dynamic Programming", slug: "dynamic-programming" }],
    companies: ["Amazon", "Microsoft", "Uber"],
    hints: ["Expand around center for each index (both odd and even length centers)."],
    sampleTestCase: "\"babad\"",
    starterTemplates: STARTER_TEMPLATES
  },
  "valid-parentheses": {
    id: "20",
    frontendQuestionId: "20",
    title: "Valid Parentheses",
    titleSlug: "valid-parentheses",
    content: `<p>Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>
<p>An input string is valid if:</p>
<ol class="list-decimal pl-5 space-y-1">
	<li>Open brackets must be closed by the same type of brackets.</li>
	<li>Open brackets must be closed in the correct order.</li>
	<li>Every close bracket has a corresponding open bracket of the same type.</li>
</ol>

<p><strong class="example font-bold">Example 1:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> s = "()"
<strong>Output:</strong> true</pre>

<p><strong class="example font-bold">Example 2:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> s = "()[]{}"
<strong>Output:</strong> true</pre>

<p><strong class="example font-bold">Example 3:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> s = "(]"
<strong>Output:</strong> false</pre>

<p><strong>Constraints:</strong></p>
<ul class="list-disc pl-5 font-mono space-y-1">
	<li><code>1 &lt;= s.length &lt;= 10<sup>4</sup></code></li>
	<li><code>s</code> consists of parentheses only <code>'()[]{}'</code>.</li>
</ul>`,
    difficulty: "Easy",
    likes: 24500,
    dislikes: 1780,
    topicTags: [{ name: "String", slug: "string" }, { name: "Stack", slug: "stack" }],
    companies: ["Meta", "Amazon", "Microsoft", "Bloomberg", "Cloudflare"],
    hints: ["Use a LIFO Stack to push opening brackets and pop matching closing brackets."],
    sampleTestCase: "\"()[]{}\"",
    starterTemplates: STARTER_TEMPLATES
  },
  "merge-two-sorted-lists": {
    id: "21",
    frontendQuestionId: "21",
    title: "Merge Two Sorted Lists",
    titleSlug: "merge-two-sorted-lists",
    content: `<p>You are given the heads of two sorted linked lists <code>list1</code> and <code>list2</code>.</p>
<p>Merge the two lists into one <strong>sorted</strong> list. The list should be made by splicing together the nodes of the first two lists.</p>
<p>Return <em>the head of the merged linked list</em>.</p>

<p><strong class="example font-bold">Example 1:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> list1 = [1,2,4], list2 = [1,3,4]
<strong>Output:</strong> [1,1,2,3,4,4]</pre>

<p><strong class="example font-bold">Example 2:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> list1 = [], list2 = []
<strong>Output:</strong> []</pre>

<p><strong>Constraints:</strong></p>
<ul class="list-disc pl-5 font-mono space-y-1">
	<li>The number of nodes in both lists is in the range <code>[0, 50]</code>.</li>
	<li><code>-100 &lt;= Node.val &lt;= 100</code></li>
	<li>Both <code>list1</code> and <code>list2</code> are sorted in <strong>non-decreasing</strong> order.</li>
</ul>`,
    difficulty: "Easy",
    likes: 22100,
    dislikes: 2150,
    topicTags: [{ name: "Linked List", slug: "linked-list" }, { name: "Recursion", slug: "recursion" }],
    companies: ["Amazon", "Microsoft", "Apple"],
    hints: ["Use a dummy head node and iteratively append the smaller node to the merged result."],
    sampleTestCase: "[1,2,4]\n[1,3,4]",
    starterTemplates: STARTER_TEMPLATES
  },
  "maximum-subarray": {
    id: "53",
    frontendQuestionId: "53",
    title: "Maximum Subarray",
    titleSlug: "maximum-subarray",
    content: `<p>Given an integer array <code>nums</code>, find the subarray with the largest sum, and return <em>its sum</em>.</p>

<p><strong class="example font-bold">Example 1:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> nums = [-2,1,-3,4,-1,2,1,-5,4]
<strong>Output:</strong> 6
<strong>Explanation:</strong> The subarray [4,-1,2,1] has the largest sum 6.</pre>

<p><strong class="example font-bold">Example 2:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> nums = [1]
<strong>Output:</strong> 1</pre>

<p><strong class="example font-bold">Example 3:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> nums = [5,4,-1,7,8]
<strong>Output:</strong> 23</pre>

<p><strong>Constraints:</strong></p>
<ul class="list-disc pl-5 font-mono space-y-1">
	<li><code>1 &lt;= nums.length &lt;= 10<sup>5</sup></code></li>
	<li><code>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></code></li>
</ul>`,
    difficulty: "Medium",
    likes: 34100,
    dislikes: 1420,
    topicTags: [{ name: "Array", slug: "array" }, { name: "Dynamic Programming", slug: "dynamic-programming" }],
    companies: ["Google", "Amazon", "Meta", "Netflix"],
    hints: ["Kadane's Algorithm: Track current max ending at index i vs overall max."],
    sampleTestCase: "[-2,1,-3,4,-1,2,1,-5,4]",
    starterTemplates: STARTER_TEMPLATES
  },
  "best-time-to-buy-and-sell-stock": {
    id: "121",
    frontendQuestionId: "121",
    title: "Best Time to Buy and Sell Stock",
    titleSlug: "best-time-to-buy-and-sell-stock",
    content: `<p>You are given an array <code>prices</code> where <code>prices[i]</code> is the price of a given stock on the <code>i<sup>th</sup></code> day.</p>
<p>You want to maximize your profit by choosing a <strong>single day</strong> to buy one stock and choosing a <strong>different day in the future</strong> to sell that stock.</p>
<p>Return <em>the maximum profit you can achieve from this transaction</em>. If you cannot achieve any profit, return <code>0</code>.</p>

<p><strong class="example font-bold">Example 1:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> prices = [7,1,5,3,6,4]
<strong>Output:</strong> 5
<strong>Explanation:</strong> Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.</pre>

<p><strong class="example font-bold">Example 2:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> prices = [7,6,4,3,1]
<strong>Output:</strong> 0
<strong>Explanation:</strong> In this case, no transactions are done and max profit = 0.</pre>

<p><strong>Constraints:</strong></p>
<ul class="list-disc pl-5 font-mono space-y-1">
	<li><code>1 &lt;= prices.length &lt;= 10<sup>5</sup></code></li>
	<li><code>0 &lt;= prices[i] &lt;= 10<sup>4</sup></code></li>
</ul>`,
    difficulty: "Easy",
    likes: 31500,
    dislikes: 1120,
    topicTags: [{ name: "Array", slug: "array" }, { name: "Dynamic Programming", slug: "dynamic-programming" }],
    companies: ["Amazon", "Meta", "Google", "Stripe"],
    hints: ["Track min price seen so far and update max profit at each step."],
    sampleTestCase: "[7,1,5,3,6,4]",
    starterTemplates: STARTER_TEMPLATES
  },
  "reverse-linked-list": {
    id: "206",
    frontendQuestionId: "206",
    title: "Reverse Linked List",
    titleSlug: "reverse-linked-list",
    content: `<p>Given the head of a singly linked list, reverse the list, and return <em>the reversed list</em>.</p>

<p><strong class="example font-bold">Example 1:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> head = [1,2,3,4,5]
<strong>Output:</strong> [5,4,3,2,1]</pre>

<p><strong class="example font-bold">Example 2:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> head = [1,2]
<strong>Output:</strong> [2,1]</pre>

<p><strong>Constraints:</strong></p>
<ul class="list-disc pl-5 font-mono space-y-1">
	<li>The number of nodes in the list is the range <code>[0, 5000]</code>.</li>
	<li><code>-5000 &lt;= Node.val &lt;= 5000</code></li>
</ul>`,
    difficulty: "Easy",
    likes: 21800,
    dislikes: 420,
    topicTags: [{ name: "Linked List", slug: "linked-list" }, { name: "Recursion", slug: "recursion" }],
    companies: ["Amazon", "Microsoft", "Meta", "NVIDIA"],
    hints: ["Iteratively re-assign pointer curr.next to prev node."],
    sampleTestCase: "[1,2,3,4,5]",
    starterTemplates: STARTER_TEMPLATES
  },
  "binary-search": {
    id: "704",
    frontendQuestionId: "704",
    title: "Binary Search",
    titleSlug: "binary-search",
    content: `<p>Given an array of integers <code>nums</code> which is sorted in ascending order, and an integer <code>target</code>, write a function to search <code>target</code> in <code>nums</code>. If <code>target</code> exists, then return its index. Otherwise, return <code>-1</code>.</p>
<p>You must write an algorithm with <code>O(log n)</code> runtime complexity.</p>

<p><strong class="example font-bold">Example 1:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> nums = [-1,0,3,5,9,12], target = 9
<strong>Output:</strong> 4
<strong>Explanation:</strong> 9 exists in nums and its index is 4</pre>

<p><strong class="example font-bold">Example 2:</strong></p>
<pre class="bg-secondary/20 p-3 rounded-lg font-mono"><strong>Input:</strong> nums = [-1,0,3,5,9,12], target = 2
<strong>Output:</strong> -1
<strong>Explanation:</strong> 2 does not exist in nums so return -1</pre>

<p><strong>Constraints:</strong></p>
<ul class="list-disc pl-5 font-mono space-y-1">
	<li><code>1 &lt;= nums.length &lt;= 10<sup>4</sup></code></li>
	<li><code>-10<sup>4</sup> &lt; nums[i], target &lt; 10<sup>4</sup></code></li>
	<li>All integers in <code>nums</code> are unique.</li>
	<li><code>nums</code> is sorted in ascending order.</li>
</ul>`,
    difficulty: "Easy",
    likes: 11400,
    dislikes: 230,
    topicTags: [{ name: "Array", slug: "array" }, { name: "Binary Search", slug: "binary-search" }],
    companies: ["Google", "Meta", "Airbnb"],
    hints: ["Maintain left and right boundaries and compute mid = left + (right - left) / 2."],
    sampleTestCase: "[-1,0,3,5,9,12]\n9",
    starterTemplates: STARTER_TEMPLATES
  },
  "remove-methods-from-project": {
    id: "3310",
    frontendQuestionId: "3310",
    title: "Remove Methods From Project",
    titleSlug: "remove-methods-from-project",
    content: `<p>You are maintaining a project with <code>n</code> methods numbered <code>0</code> to <code>n - 1</code>. You are given an integer <code>k</code> and a 2D array <code>invocations</code> where <code>invocations[i] = [u, v]</code> indicates method <code>u</code> invokes method <code>v</code>.</p>
<p>Method <code>k</code> is suspicious. Find all methods reachable from <code>k</code> using DFS/BFS. Return the remaining non-removed methods array.</p>`,
    difficulty: "Medium",
    likes: 240,
    dislikes: 15,
    topicTags: [{ name: "Depth-First Search", slug: "depth-first-search" }, { name: "Graph", slug: "graph" }],
    companies: ["Google", "OpenAI"],
    hints: ["Traverse from k using BFS or DFS to identify connected components."],
    sampleTestCase: "4\n1\n[[1,2],[0,1],[2,0]]",
    starterTemplates: STARTER_TEMPLATES
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug.toLowerCase().trim();

  const problem = COMPLIANT_PROBLEM_DETAILS[slug] || {
    id: "1",
    frontendQuestionId: "1",
    title: slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    titleSlug: slug,
    content: `<p>Given an array or collection of items for <strong>${slug}</strong>, implement an efficient algorithmic solution adhering to problem constraints.</p>`,
    difficulty: "Medium",
    likes: 1450,
    dislikes: 32,
    topicTags: [{ name: "Algorithms", slug: "algorithms" }],
    companies: ["Google", "Meta", "Amazon"],
    hints: ["Analyze time complexity and utilize hash maps, two pointers, or binary search where applicable."],
    sampleTestCase: "[1, 2, 3]\n6",
    starterTemplates: STARTER_TEMPLATES
  };

  return NextResponse.json({
    success: true,
    problem
  });
}
