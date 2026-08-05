import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FALLBACK_PROBLEMS = [
  {
    frontendQuestionId: "1",
    title: "Two Sum",
    titleSlug: "two-sum",
    difficulty: "Easy",
    acRate: 51.5,
    topicTags: [{ name: "Array", slug: "array" }, { name: "Hash Table", slug: "hash-table" }],
    paidOnly: false,
    status: "solved",
    hasSolution: true,
  },
  {
    frontendQuestionId: "2",
    title: "Add Two Numbers",
    titleSlug: "add-two-numbers",
    difficulty: "Medium",
    acRate: 41.2,
    topicTags: [{ name: "Linked List", slug: "linked-list" }, { name: "Math", slug: "math" }, { name: "Recursion", slug: "recursion" }],
    paidOnly: false,
    status: "solved",
    hasSolution: true,
  },
  {
    frontendQuestionId: "3",
    title: "Longest Substring Without Repeating Characters",
    titleSlug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    acRate: 34.8,
    topicTags: [{ name: "Hash Table", slug: "hash-table" }, { name: "String", slug: "string" }, { name: "Sliding Window", slug: "sliding-window" }],
    paidOnly: false,
    status: "ac",
    hasSolution: true,
  },
  {
    frontendQuestionId: "4",
    title: "Median of Two Sorted Arrays",
    titleSlug: "median-of-two-sorted-arrays",
    difficulty: "Hard",
    acRate: 38.6,
    topicTags: [{ name: "Array", slug: "array" }, { name: "Binary Search", slug: "binary-search" }, { name: "Divide and Conquer", slug: "divide-and-conquer" }],
    paidOnly: false,
    status: "not_started",
    hasSolution: true,
  },
  {
    frontendQuestionId: "5",
    title: "Longest Palindromic Substring",
    titleSlug: "longest-palindromic-substring",
    difficulty: "Medium",
    acRate: 33.7,
    topicTags: [{ name: "Two Pointers", slug: "two-pointers" }, { name: "String", slug: "string" }, { name: "Dynamic Programming", slug: "dynamic-programming" }],
    paidOnly: false,
    status: "not_started",
    hasSolution: true,
  },
  {
    frontendQuestionId: "20",
    title: "Valid Parentheses",
    titleSlug: "valid-parentheses",
    difficulty: "Easy",
    acRate: 40.5,
    topicTags: [{ name: "String", slug: "string" }, { name: "Stack", slug: "stack" }],
    paidOnly: false,
    status: "solved",
    hasSolution: true,
  },
  {
    frontendQuestionId: "21",
    title: "Merge Two Sorted Lists",
    titleSlug: "merge-two-sorted-lists",
    difficulty: "Easy",
    acRate: 63.4,
    topicTags: [{ name: "Linked List", slug: "linked-list" }, { name: "Recursion", slug: "recursion" }],
    paidOnly: false,
    status: "not_started",
    hasSolution: true,
  },
  {
    frontendQuestionId: "53",
    title: "Maximum Subarray",
    titleSlug: "maximum-subarray",
    difficulty: "Medium",
    acRate: 50.8,
    topicTags: [{ name: "Array", slug: "array" }, { name: "Divide and Conquer", slug: "divide-and-conquer" }, { name: "Dynamic Programming", slug: "dynamic-programming" }],
    paidOnly: false,
    status: "not_started",
    hasSolution: true,
  },
  {
    frontendQuestionId: "121",
    title: "Best Time to Buy and Sell Stock",
    titleSlug: "best-time-to-buy-and-sell-stock",
    difficulty: "Easy",
    acRate: 53.7,
    topicTags: [{ name: "Array", slug: "array" }, { name: "Dynamic Programming", slug: "dynamic-programming" }],
    paidOnly: false,
    status: "solved",
    hasSolution: true,
  },
  {
    frontendQuestionId: "206",
    title: "Reverse Linked List",
    titleSlug: "reverse-linked-list",
    difficulty: "Easy",
    acRate: 75.1,
    topicTags: [{ name: "Linked List", slug: "linked-list" }, { name: "Recursion", slug: "recursion" }],
    paidOnly: false,
    status: "solved",
    hasSolution: true,
  },
  {
    frontendQuestionId: "704",
    title: "Binary Search",
    titleSlug: "binary-search",
    difficulty: "Easy",
    acRate: 56.8,
    topicTags: [{ name: "Array", slug: "array" }, { name: "Binary Search", slug: "binary-search" }],
    paidOnly: false,
    status: "solved",
    hasSolution: true,
  },
  {
    frontendQuestionId: "3310",
    title: "Remove Methods From Project",
    titleSlug: "remove-methods-from-project",
    difficulty: "Medium",
    acRate: 63.0,
    topicTags: [{ name: "Depth-First Search", slug: "depth-first-search" }, { name: "Breadth-First Search", slug: "breadth-first-search" }, { name: "Graph", slug: "graph" }],
    paidOnly: false,
    status: "solved",
    hasSolution: true,
  }
];

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const category = searchParams.get("category") || "";
  const difficulty = searchParams.get("difficulty") || "";
  const search = (searchParams.get("search") || "").toLowerCase().trim();
  const limit = parseInt(searchParams.get("limit") || "50");
  const skip = parseInt(searchParams.get("skip") || "0");

  try {
    const query = `
      query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
          categorySlug: $categorySlug
          limit: $limit
          skip: $skip
          filters: $filters
        ) {
          total: totalNum
          questions: questions {
            acRate
            difficulty
            frontendQuestionId: questionId
            isFavor
            paidOnly: isPaidOnly
            status
            title
            titleSlug
            topicTags {
              name
              slug
            }
            hasSolution
          }
        }
      }
    `;

    const filters: any = {};
    if (difficulty) {
      filters.difficulty = difficulty.toUpperCase();
    }
    if (search) {
      filters.searchKeywords = search;
    }

    const { secureFetch } = await import("packages/security");
    const res = await secureFetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://leetcode.com/problemset/all/",
      },
      body: JSON.stringify({
        query,
        variables: {
          categorySlug: category || "",
          limit,
          skip,
          filters,
        },
      }),
      allowedProvider: "custom",
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const data = await res.json();
      const questionList = data?.data?.problemsetQuestionList;
      if (questionList?.questions?.length) {
        return NextResponse.json({
          success: true,
          total: questionList.total || questionList.questions.length,
          questions: questionList.questions,
          source: "leetcode_live",
        });
      }
    }
  } catch (err: any) {
    console.warn("LeetCode GraphQL live fetch timed out or failed, serving fallback database:", err?.message);
  }

  // Filter fallback database if live API is unavailable
  let filtered = [...FALLBACK_PROBLEMS];
  if (difficulty) {
    filtered = filtered.filter((q) => q.difficulty.toLowerCase() === difficulty.toLowerCase());
  }
  if (search) {
    filtered = filtered.filter(
      (q) => q.title.toLowerCase().includes(search) || q.frontendQuestionId.includes(search) || q.topicTags.some(t => t.name.toLowerCase().includes(search))
    );
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    questions: filtered.slice(skip, skip + limit),
    source: "local_cache",
  });
}
