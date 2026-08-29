// packages/coding-engine/complexity-profiler.ts
// Algorithmic Big-O Time & Space Complexity Profiler and Edge Case Analyzer

export interface ComplexityAnalysisResult {
  timeComplexity: string;
  spaceComplexity: string;
  bottlenecks: string[];
  optimizations: string[];
  edgeCasesToTest: {
    name: string;
    input: string;
    expectedBehavior: string;
    criticality: "HIGH" | "MEDIUM" | "LOW";
  }[];
  socraticHints: string[];
}

export function profileCodeComplexity(
  code: string,
  language: string = "typescript"
): ComplexityAnalysisResult {
  const cleanCode = code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, ""); // strip comments

  // Detect loop nestings
  const forLoops = (cleanCode.match(/\bfor\s*\(/g) || []).length;
  const whileLoops = (cleanCode.match(/\bwhile\s*\(/g) || []).length;
  const totalLoops = forLoops + whileLoops;

  // Detect recursive calls or nested loops
  const hasNestedLoops = /for\s*\([^)]*\)\s*\{[^}]*for\s*\(/g.test(cleanCode) ||
                         /while\s*\([^)]*\)\s*\{[^}]*while\s*\(/g.test(cleanCode) ||
                         /for\s*\([^)]*\)\s*\{[^}]*while\s*\(/g.test(cleanCode);

  // Detect sorting operations
  const hasSort = /\.sort\(|Arrays\.sort|std::sort|sort\(/g.test(cleanCode);

  // Detect hash map / set usage for space
  const hasHashMap = /new Map\(|new Set\(|HashMap|unordered_map|dict\(|\{\}/g.test(cleanCode);
  const hasArrayAlloc = /new Array\(|vector<|\[\]|\.slice\(|\.map\(/g.test(cleanCode);

  let timeComplexity = "O(1) Constant";
  let spaceComplexity = "O(1) Auxiliary";
  const bottlenecks: string[] = [];
  const optimizations: string[] = [];

  if (hasNestedLoops) {
    timeComplexity = "O(N²) Quadratic";
    bottlenecks.push("Nested loop detected — potential performance degradation on large inputs (N > 10,000).");
    optimizations.push("Consider using a Hash Map or Two-Pointer technique to reduce complexity from O(N²) to O(N).");
  } else if (hasSort) {
    timeComplexity = "O(N log N) Linearithmic";
    bottlenecks.push("In-place or array sorting operation dominates the execution time.");
    optimizations.push("If values fall in a bounded range, examine Counting Sort or Radix Sort for O(N) execution.");
  } else if (totalLoops > 0) {
    timeComplexity = "O(N) Linear";
    bottlenecks.push("Single pass traversal proportional to input size.");
    optimizations.push("Ensure early exit conditions (break/return) are triggered as soon as target element is found.");
  }

  if (hasHashMap && hasArrayAlloc) {
    spaceComplexity = "O(N) Linear Space";
  } else if (hasHashMap || hasArrayAlloc) {
    spaceComplexity = "O(N) Auxiliary Space";
  }

  const edgeCasesToTest = [
    {
      name: "Empty / Null Input",
      input: "[], null, undefined, or \"\"",
      expectedBehavior: "Should gracefully return empty structure, 0, or false without throwing NullPointer/TypeError.",
      criticality: "HIGH" as const,
    },
    {
      name: "Single Element Array / Monad",
      input: "[42] or \"a\"",
      expectedBehavior: "Verify loop boundaries and indexing do not trigger OutOfBounds or off-by-one errors.",
      criticality: "HIGH" as const,
    },
    {
      name: "Duplicate Elements & Colocated Values",
      input: "[5, 5, 5, 5, 5]",
      expectedBehavior: "Ensure pointers and frequency maps handle duplicate frequencies correctly without infinite loops.",
      criticality: "MEDIUM" as const,
    },
    {
      name: "Extreme Scale / Integer Boundary",
      input: "Array with 100,000 elements, INT_MAX (2³¹ - 1)",
      expectedBehavior: "Evaluate arithmetic overflow safety and heap allocation limits.",
      criticality: "MEDIUM" as const,
    },
  ];

  const socraticHints = [
    "Step 1: Can we store seen elements in a Set or Map to achieve O(1) instantaneous lookup?",
    "Step 2: If the collection is sorted or monotonic, can a Binary Search or Two-Pointer approach eliminate unnecessary iterations?",
    "Step 3: What invariant holds true after each step in your algorithm?",
  ];

  return {
    timeComplexity,
    spaceComplexity,
    bottlenecks: bottlenecks.length > 0 ? bottlenecks : ["No major computational bottlenecks identified."],
    optimizations: optimizations.length > 0 ? optimizations : ["Code structure is clean and within optimal bounds."],
    edgeCasesToTest,
    socraticHints,
  };
}
