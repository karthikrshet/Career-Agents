// packages/coding-engine/index.ts

export * from "./complexity-profiler";

export interface CodingLanguage {
  id: string;
  label: string;
  ext: string;
  monacoId: string;
  pistonLang: string;
  judge0Id: number;
}

export const SUPPORTED_20_LANGUAGES: CodingLanguage[] = [
  { id: "c", label: "C", ext: ".c", monacoId: "c", pistonLang: "c", judge0Id: 75 },
  { id: "cpp", label: "C++", ext: ".cpp", monacoId: "cpp", pistonLang: "cpp", judge0Id: 76 },
  { id: "java", label: "Java", ext: ".java", monacoId: "java", pistonLang: "java", judge0Id: 91 },
  { id: "python", label: "Python", ext: ".py", monacoId: "python", pistonLang: "python3", judge0Id: 92 },
  { id: "python3", label: "Python3", ext: ".py", monacoId: "python", pistonLang: "python3", judge0Id: 92 },
  { id: "javascript", label: "JavaScript", ext: ".js", monacoId: "javascript", pistonLang: "javascript", judge0Id: 93 },
  { id: "typescript", label: "TypeScript", ext: ".ts", monacoId: "typescript", pistonLang: "typescript", judge0Id: 94 },
  { id: "go", label: "Go", ext: ".go", monacoId: "go", pistonLang: "go", judge0Id: 95 },
  { id: "rust", label: "Rust", ext: ".rs", monacoId: "rust", pistonLang: "rust", judge0Id: 73 },
  { id: "kotlin", label: "Kotlin", ext: ".kt", monacoId: "kotlin", pistonLang: "kotlin", judge0Id: 78 },
  { id: "swift", label: "Swift", ext: ".swift", monacoId: "swift", pistonLang: "swift", judge0Id: 83 },
  { id: "dart", label: "Dart", ext: ".dart", monacoId: "dart", pistonLang: "dart", judge0Id: 90 },
  { id: "php", label: "PHP", ext: ".php", monacoId: "php", pistonLang: "php", judge0Id: 68 },
  { id: "ruby", label: "Ruby", ext: ".rb", monacoId: "ruby", pistonLang: "ruby", judge0Id: 72 },
  { id: "scala", label: "Scala", ext: ".scala", monacoId: "scala", pistonLang: "scala", judge0Id: 81 },
  { id: "csharp", label: "C#", ext: ".cs", monacoId: "csharp", pistonLang: "csharp", judge0Id: 51 },
  { id: "elixir", label: "Elixir", ext: ".ex", monacoId: "elixir", pistonLang: "elixir", judge0Id: 57 },
  { id: "erlang", label: "Erlang", ext: ".erl", monacoId: "erlang", pistonLang: "erlang", judge0Id: 58 },
  { id: "racket", label: "Racket", ext: ".rkt", monacoId: "scheme", pistonLang: "racket", judge0Id: 84 },
  { id: "bash", label: "Bash", ext: ".sh", monacoId: "shell", pistonLang: "bash", judge0Id: 46 },
];

export const STARTER_TEMPLATES: Record<string, string> = {
  c: `#include <stdio.h>\n#include <stdlib.h>\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    *returnSize = 2;\n    int* res = (int*)malloc(2 * sizeof(int));\n    for (int i = 0; i < numsSize; i++) {\n        for (int j = i + 1; j < numsSize; j++) {\n            if (nums[i] + nums[j] == target) {\n                res[0] = i; res[1] = j;\n                return res;\n            }\n        }\n    }\n    return res;\n}\n\nint main() {\n    printf("Two Sum Solution in C\\n");\n    return 0;\n}`,
  cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> mp;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if (mp.count(comp)) return {mp[comp], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};\n\nint main() {\n    Solution sol;\n    vector<int> nums = {2, 7, 11, 15};\n    auto res = sol.twoSum(nums, 9);\n    cout << "[" << res[0] << ", " << res[1] << "]" << endl;\n    return 0;\n}`,
  java: `import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[] { map.get(comp), i };\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int[] res = sol.twoSum(new int[]{2, 7, 11, 15}, 9);\n        System.out.println(Arrays.toString(res));\n    }\n}`,
  python3: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            comp = target - num\n            if comp in seen:\n                return [seen[comp], i]\n            seen[num] = i\n        return []\n\nif __name__ == "__main__":\n    sol = Solution()\n    print(sol.twoSum([2, 7, 11, 15], 9))  # [0, 1]`,
  python: `class Solution(object):\n    def twoSum(self, nums, target):\n        seen = {}\n        for i, num in enumerate(nums):\n            comp = target - num\n            if comp in seen:\n                return [seen[comp], i]\n            seen[num] = i\n        return []`,
  javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const comp = target - nums[i];\n        if (map.has(comp)) return [map.get(comp), i];\n        map.set(nums[i], i);\n    }\n    return [];\n};\n\nconsole.log(twoSum([2, 7, 11, 15], 9));`,
  typescript: `function twoSum(nums: number[], target: number): number[] {\n    const map = new Map<number, number>();\n    for (let i = 0; i < nums.length; i++) {\n        const comp = target - nums[i];\n        if (map.has(comp)) return [map.get(comp)!, i];\n        map.set(nums[i], i);\n    }\n    return [];\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));`,
  go: `package main\nimport "fmt"\n\nfunc twoSum(nums []int, target int) []int {\n    m := make(map[int]int)\n    for i, num := range nums {\n        if idx, ok := m[target-num]; ok {\n            return []int{idx, i}\n        }\n        m[num] = i\n    }\n    return nil\n}\n\nfunc main() {\n    fmt.Println(twoSum([]int{2, 7, 11, 15}, 9))\n}`,
  rust: `use std::collections::HashMap;\n\nimpl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        let mut map = HashMap::new();\n        for (i, &num) in nums.iter().enumerate() {\n            if let Some(&idx) = map.get(&(target - num)) {\n                return vec![idx as i32, i as i32];\n            }\n            map.insert(num, i);\n        }\n        vec![]\n    }\n}\n\nfn main() {\n    println!("Rust solution loaded");\n}`,
  kotlin: `class Solution {\n    fun twoSum(nums: IntArray, target: Int): IntArray {\n        val map = HashMap<Int, Int>()\n        for (i in nums.indices) {\n            val comp = target - nums[i]\n            if (map.containsKey(comp)) return intArrayOf(map[comp]!!, i)\n            map[nums[i]] = i\n        }\n        return intArrayOf()\n    }\n}`,
  swift: `class Solution {\n    func twoSum(_ nums: [Int], _ target: Int) -> [Int] {\n        var dict = [Int: Int]()\n        for (i, num) in nums.enumerated() {\n            if let idx = dict[target - num] { return [idx, i] }\n            dict[num] = i\n        }\n        return []\n    }\n}`,
  dart: `class Solution {\n  List<int> twoSum(List<int> nums, int target) {\n    final map = <int, int>{};\n    for (var i = 0; i < nums.length; i++) {\n      final comp = target - nums[i];\n      if (map.containsKey(comp)) return [map[comp]!, i];\n      map[nums[i]] = i;\n    }\n    return [];\n  }\n}`,
  php: `class Solution {\n    function twoSum($nums, $target) {\n        $map = [];\n        foreach ($nums as $i => $num) {\n            $comp = $target - $num;\n            if (isset($map[$comp])) return [$map[$comp], $i];\n            $map[$num] = $i;\n        }\n        return [];\n    }\n}`,
  ruby: `def two_sum(nums, target)\n    map = {}\n    nums.each_with_index do |num, i|\n        return [map[target - num], i] if map.key?(target - num)\n        map[num] = i\n    end\nend`,
  scala: `object Solution {\n    def twoSum(nums: Array[Int], target: Int): Array[Int] = {\n        val map = scala.collection.mutable.Map[Int, Int]()\n        for (i <- nums.indices) {\n            val comp = target - nums(i)\n            if (map.contains(comp)) return Array(map(comp), i)\n            map(nums(i)) = i\n        }\n        Array()\n    }\n}`,
  csharp: `using System;\nusing System.Collections.Generic;\n\npublic class Solution {\n    public int[] TwoSum(int[] nums, int target) {\n        var map = new Dictionary<int, int>();\n        for (int i = 0; i < nums.Length; i++) {\n            int comp = target - nums[i];\n            if (map.ContainsKey(comp)) return new int[] { map[comp], i };\n            map[nums[i]] = i;\n        }\n        return new int[0];\n    }\n}`,
  elixir: `defmodule Solution do\n  def two_sum(nums, target) do\n    Enum.reduce_while(Enum.with_index(nums), %{}, fn {num, i}, acc ->\n      comp = target - num\n      if Map.has_key?(acc, comp) do\n        {:halt, [Map.get(acc, comp), i]}\n      else\n        {:cont, Map.put(acc, num, i)}\n      end\n    end)\n  end\nend`,
  erlang: `-module(solution).\n-export([two_sum/2]).\n\ntwo_sum(_Nums, _Target) ->\n  [0, 1].`,
  racket: `(define/contract (two-sum nums target)\n  (-> (listof exact-integer?) exact-integer? (listof exact-integer?))\n  '(0 1))`,
  bash: `#!/bin/bash\necho "Running Bash Script solution"\necho "[0, 1]"`
};

export const COMPANY_LIST = [
  { name: "Google", logo: "🟢", count: 2335 },
  { name: "Meta", logo: "🔵", count: 1540 },
  { name: "Amazon", logo: "🟠", count: 1996 },
  { name: "Microsoft", logo: "🟦", count: 1105 },
  { name: "Apple", logo: "🍎", count: 301 },
  { name: "Netflix", logo: "🔴", count: 185 },
  { name: "Stripe", logo: "💜", count: 240 },
  { name: "OpenAI", logo: "✳️", count: 310 },
  { name: "Uber", logo: "🖤", count: 420 },
  { name: "Airbnb", logo: "💖", count: 210 },
  { name: "Bloomberg", logo: "📊", count: 1212 },
  { name: "Snowflake", logo: "❄️", count: 190 },
  { name: "Databricks", logo: "🧱", count: 220 },
  { name: "Cloudflare", logo: "🟧", count: 175 },
  { name: "NVIDIA", logo: "🟢", count: 480 },
];

export const ROADMAP_COLLECTIONS = [
  { id: "blind75", title: "Blind 75 Must-Do LeetCode Questions", count: 75, icon: "🔥" },
  { id: "neetcode150", title: "NeetCode 150 Algorithm Roadmap", count: 150, icon: "🎯" },
  { id: "top150", title: "Top Interview 150 Questions", count: 150, icon: "⭐" },
  { id: "faang_hard", title: "FAANG System & Hard Algorithmic Questions", count: 50, icon: "⚡" },
];
