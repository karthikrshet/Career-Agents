import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COMPLIANT_PROBLEMS_CATALOG = [
  {
    id: "1",
    frontendQuestionId: "1",
    title: "Two Sum",
    titleSlug: "two-sum",
    difficulty: "Easy",
    acRate: 51.5,
    topicTags: [{ name: "Array", slug: "array" }, { name: "Hash Table", slug: "hash-table" }],
    companies: ["Google", "Amazon", "Meta", "Microsoft", "Apple"],
    roadmapCollections: ["blind75", "neetcode150", "top150"],
    status: "solved",
    hasSolution: true,
  },
  {
    id: "2",
    frontendQuestionId: "2",
    title: "Add Two Numbers",
    titleSlug: "add-two-numbers",
    difficulty: "Medium",
    acRate: 41.2,
    topicTags: [{ name: "Linked List", slug: "linked-list" }, { name: "Math", slug: "math" }],
    companies: ["Amazon", "Microsoft", "Meta", "Bloomberg"],
    roadmapCollections: ["blind75", "neetcode150", "top150"],
    status: "solved",
    hasSolution: true,
  },
  {
    id: "3",
    frontendQuestionId: "3",
    title: "Longest Substring Without Repeating Characters",
    titleSlug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    acRate: 34.8,
    topicTags: [{ name: "Hash Table", slug: "hash-table" }, { name: "String", slug: "string" }, { name: "Sliding Window", slug: "sliding-window" }],
    companies: ["Google", "Meta", "Amazon", "OpenAI"],
    roadmapCollections: ["blind75", "neetcode150", "top150"],
    status: "ac",
    hasSolution: true,
  },
  {
    id: "4",
    frontendQuestionId: "4",
    title: "Median of Two Sorted Arrays",
    titleSlug: "median-of-two-sorted-arrays",
    difficulty: "Hard",
    acRate: 38.6,
    topicTags: [{ name: "Array", slug: "array" }, { name: "Binary Search", slug: "binary-search" }],
    companies: ["Google", "Amazon", "Databricks", "Snowflake"],
    roadmapCollections: ["blind75", "faang_hard"],
    status: "not_started",
    hasSolution: true,
  },
  {
    id: "5",
    frontendQuestionId: "5",
    title: "Longest Palindromic Substring",
    titleSlug: "longest-palindromic-substring",
    difficulty: "Medium",
    acRate: 33.7,
    topicTags: [{ name: "Two Pointers", slug: "two-pointers" }, { name: "Dynamic Programming", slug: "dynamic-programming" }],
    companies: ["Amazon", "Microsoft", "Uber"],
    roadmapCollections: ["blind75", "neetcode150"],
    status: "not_started",
    hasSolution: true,
  },
  {
    id: "20",
    frontendQuestionId: "20",
    title: "Valid Parentheses",
    titleSlug: "valid-parentheses",
    difficulty: "Easy",
    acRate: 40.5,
    topicTags: [{ name: "String", slug: "string" }, { name: "Stack", slug: "stack" }],
    companies: ["Meta", "Amazon", "Microsoft", "Bloomberg", "Cloudflare"],
    roadmapCollections: ["blind75", "neetcode150", "top150"],
    status: "solved",
    hasSolution: true,
  },
  {
    id: "21",
    frontendQuestionId: "21",
    title: "Merge Two Sorted Lists",
    titleSlug: "merge-two-sorted-lists",
    difficulty: "Easy",
    acRate: 63.4,
    topicTags: [{ name: "Linked List", slug: "linked-list" }, { name: "Recursion", slug: "recursion" }],
    companies: ["Amazon", "Microsoft", "Apple"],
    roadmapCollections: ["blind75", "neetcode150", "top150"],
    status: "not_started",
    hasSolution: true,
  },
  {
    id: "53",
    frontendQuestionId: "53",
    title: "Maximum Subarray",
    titleSlug: "maximum-subarray",
    difficulty: "Medium",
    acRate: 50.8,
    topicTags: [{ name: "Array", slug: "array" }, { name: "Dynamic Programming", slug: "dynamic-programming" }],
    companies: ["Google", "Amazon", "Meta", "Netflix"],
    roadmapCollections: ["blind75", "neetcode150", "top150"],
    status: "not_started",
    hasSolution: true,
  },
  {
    id: "121",
    frontendQuestionId: "121",
    title: "Best Time to Buy and Sell Stock",
    titleSlug: "best-time-to-buy-and-sell-stock",
    difficulty: "Easy",
    acRate: 53.7,
    topicTags: [{ name: "Array", slug: "array" }, { name: "Dynamic Programming", slug: "dynamic-programming" }],
    companies: ["Amazon", "Meta", "Google", "Stripe"],
    roadmapCollections: ["blind75", "neetcode150", "top150"],
    status: "solved",
    hasSolution: true,
  },
  {
    id: "206",
    frontendQuestionId: "206",
    title: "Reverse Linked List",
    titleSlug: "reverse-linked-list",
    difficulty: "Easy",
    acRate: 75.1,
    topicTags: [{ name: "Linked List", slug: "linked-list" }],
    companies: ["Amazon", "Microsoft", "Meta", "NVIDIA"],
    roadmapCollections: ["blind75", "neetcode150", "top150"],
    status: "solved",
    hasSolution: true,
  },
  {
    id: "704",
    frontendQuestionId: "704",
    title: "Binary Search",
    titleSlug: "binary-search",
    difficulty: "Easy",
    acRate: 56.8,
    topicTags: [{ name: "Array", slug: "array" }, { name: "Binary Search", slug: "binary-search" }],
    companies: ["Google", "Meta", "Airbnb"],
    roadmapCollections: ["blind75", "neetcode150"],
    status: "solved",
    hasSolution: true,
  },
  {
    id: "3310",
    frontendQuestionId: "3310",
    title: "Remove Methods From Project",
    titleSlug: "remove-methods-from-project",
    difficulty: "Medium",
    acRate: 63.0,
    topicTags: [{ name: "Depth-First Search", slug: "depth-first-search" }, { name: "Graph", slug: "graph" }],
    companies: ["Google", "OpenAI"],
    roadmapCollections: ["faang_hard"],
    status: "solved",
    hasSolution: true,
  }
];

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const company = searchParams.get("company") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const roadmap = searchParams.get("roadmap") || "";
  const search = (searchParams.get("search") || "").toLowerCase().trim();

  let filtered = [...COMPLIANT_PROBLEMS_CATALOG];

  if (company) {
    filtered = filtered.filter(p => p.companies.some(c => c.toLowerCase() === company.toLowerCase()));
  }
  if (difficulty) {
    filtered = filtered.filter(p => p.difficulty.toLowerCase() === difficulty.toLowerCase());
  }
  if (roadmap) {
    filtered = filtered.filter(p => p.roadmapCollections.includes(roadmap.toLowerCase()));
  }
  if (search) {
    filtered = filtered.filter(
      p => p.title.toLowerCase().includes(search) || p.frontendQuestionId.includes(search) || p.topicTags.some(t => t.name.toLowerCase().includes(search))
    );
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    problems: filtered,
    catalogMeta: {
      totalProblems: 240,
      companiesCount: 15,
      roadmapsCount: 4
    }
  });
}
