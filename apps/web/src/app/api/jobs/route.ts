// apps/web/src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { secureFetch, escapeHTML, enforceRequestLimits } from "packages/security";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  countryCode: string;
  countryFlag: string;
  domainCategory: string;
  type: "Remote" | "Hybrid" | "Onsite";
  salary?: string;
  experience: string;
  experienceLevel: "Entry" | "Mid" | "Senior" | "Lead";
  tech: string[];
  source: string;
  sourceUrl: string;
  postedAt: string;
  visaSponsorship: boolean;
  description?: string;
}

let jobCache: { data: JobListing[]; timestamp: number; key: string } | null = null;
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

function sanitizeHtmlText(htmlStr: string | undefined | null): string {
  if (!htmlStr) return "";
  let current = String(htmlStr);
  let previous = "";
  while (current !== previous) {
    previous = current;
    current = current.replace(/<[^>]*>/g, "");
  }
  return current.replace(/\s+/g, " ").trim().slice(0, 300);
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const clientIp = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1").trim();
  const limitResponse = enforceRequestLimits(req, clientIp, { isUser: !!session?.user });
  if (limitResponse) return limitResponse;

  const searchParams = req.nextUrl.searchParams;
  const queryParam = (searchParams.get("q") || "").toLowerCase().trim();
  const countryParam = (searchParams.get("country") || "all").toLowerCase().trim();
  const domainParam = (searchParams.get("domain") || "all").toLowerCase().trim();
  const experienceParam = (searchParams.get("experience") || "all").toLowerCase().trim();
  const typeParam = searchParams.get("type") || "All";
  const visaParam = searchParams.get("visa") === "true";

  const cacheKey = `${queryParam}-${countryParam}-${domainParam}-${experienceParam}-${typeParam}-${visaParam}`;
  const now = Date.now();
  if (jobCache && jobCache.key === cacheKey && (now - jobCache.timestamp < CACHE_DURATION)) {
    return NextResponse.json(jobCache.data);
  }

  const rawJobs: JobListing[] = [];

  const extractTech = (text: string): string[] => {
    const list = ["TypeScript", "JavaScript", "Python", "React", "Node.js", "Next.js", "Go", "Rust", "C++", "Java", "Ruby", "Docker", "Kubernetes", "AWS", "SQL", "GraphQL", "PostgreSQL", "MongoDB", "FastAPI", "PyTorch", "TensorFlow", "Tailwind CSS", "Vue.js", "System Design", "Microservices", "REST APIs", "CI/CD", "DevOps"];
    const found = list.filter(t => new RegExp(`\\b${t.replace(/[.+]/g, "\\$&")}\\b`, "i").test(text));
    return found.length > 0 ? found : ["TypeScript", "React", "Node.js", "System Design"];
  };

  const detectDomain = (title: string, desc: string): string => {
    const combined = `${title} ${desc}`.toLowerCase();
    if (/ai|ml|machine learning|deep learning|data scientist|nlp|llm|rag|computer vision/i.test(combined)) return "ai-engineer";
    if (/frontend|ui|react|vue|next\.js|angular|web developer/i.test(combined)) return "frontend-engineer";
    if (/backend|api|server|golang|node|java|python|distributed systems|microservices/i.test(combined)) return "backend-engineer";
    if (/full stack|fullstack|web engineer/i.test(combined)) return "fullstack-engineer";
    if (/devops|cloud|infrastructure|sre|kubernetes|aws|terraform|sysadmin/i.test(combined)) return "cloud-engineer";
    if (/security|cyber|penetration|soc|infosec/i.test(combined)) return "cybersecurity-engineer";
    if (/product manager|pm|product owner|technical pm/i.test(combined)) return "product-manager";
    if (/ux|ui|designer|design system|figma/i.test(combined)) return "ux-designer";
    return "software-engineer";
  };

  const detectCountry = (loc: string): { code: string; flag: string } => {
    const l = loc.toLowerCase();
    if (l.includes("india") || l.includes("bengaluru") || l.includes("bangalore") || l.includes("delhi") || l.includes("mumbai") || l.includes("hyderabad") || l.includes("pune") || l.includes("gurgaon")) {
      return { code: "in", flag: "🇮🇳" };
    }
    if (l.includes("united kingdom") || l.includes("london") || l.includes("uk") || l.includes("manchester") || l.includes("cambridge")) {
      return { code: "uk", flag: "🇬🇧" };
    }
    if (l.includes("canada") || l.includes("toronto") || l.includes("vancouver") || l.includes("montreal")) {
      return { code: "ca", flag: "🇨🇦" };
    }
    if (l.includes("germany") || l.includes("berlin") || l.includes("munich") || l.includes("hamburg") || l.includes("eu") || l.includes("europe")) {
      return { code: "de", flag: "🇩🇪" };
    }
    if (l.includes("remote") || l.includes("worldwide") || l.includes("global") || l.includes("anywhere")) {
      return { code: "remote", flag: "🌐" };
    }
    return { code: "us", flag: "🇺🇸" };
  };

  const detectExpLevel = (title: string, desc: string): { label: string; level: "Entry" | "Mid" | "Senior" | "Lead" } => {
    const combined = `${title} ${desc}`.toLowerCase();
    if (/junior|entry|intern|graduate|fresher|associate|0-2|1-2/i.test(combined)) {
      return { label: "0–2 years (Entry)", level: "Entry" };
    }
    if (/staff|principal|lead|director|architect|head|vp|8\+/i.test(combined)) {
      return { label: "8+ years (Staff/Lead)", level: "Lead" };
    }
    if (/senior|sr\.|tech lead|5\+/i.test(combined)) {
      return { label: "5+ years (Senior)", level: "Senior" };
    }
    return { label: "2–5 years (Mid)", level: "Mid" };
  };

  // 1. Remotive Public API (Global Tech & Remote Jobs)
  try {
    const category = domainParam.includes("frontend") ? "frontend" : domainParam.includes("backend") ? "backend" : domainParam.includes("data") || domainParam.includes("ai") ? "data" : domainParam.includes("devops") ? "devops" : "software-dev";
    const remotiveRes = await secureFetch(`https://remotive.com/api/remote-jobs?category=${category}&limit=25`, {
      allowedProvider: "custom"
    });
    if (remotiveRes.ok) {
      const data = await remotiveRes.json();
      if (data && Array.isArray(data.jobs)) {
        data.slice(0, 15).forEach((item: any) => {
          const loc = item.candidate_required_location || "Worldwide Remote";
          const country = detectCountry(loc);
          const exp = detectExpLevel(item.title, item.description || "");
          const dom = detectDomain(item.title, item.description || "");
          rawJobs.push({
            id: `rem-${item.id}`,
            title: item.title,
            company: item.company_name || "Tech Startup",
            location: loc,
            countryCode: country.code,
            countryFlag: country.flag,
            domainCategory: dom,
            type: "Remote",
            salary: item.salary || "$110k–$170k",
            experience: exp.label,
            experienceLevel: exp.level,
            tech: item.tags && item.tags.length > 0 ? item.tags.slice(0, 5) : extractTech(item.title + " " + item.description),
            source: "Remotive",
            sourceUrl: item.url || "https://remotive.com",
            postedAt: item.publication_date ? timeAgo(new Date(item.publication_date)) : "1d ago",
            visaSponsorship: true,
            description: sanitizeHtmlText(item.description),
          });
        });
      }
    }
  } catch (err) {
    console.error("Remotive fetch error:", err);
  }

  // 2. Arbeitnow Live Job API (EU, US, UK & Global Remote Jobs)
  try {
    const arbeitRes = await secureFetch("https://www.arbeitnow.com/api/job-board-api", {
      allowedProvider: "custom"
    });
    if (arbeitRes.ok) {
      const data = await arbeitRes.json();
      if (data && Array.isArray(data.data)) {
        data.slice(0, 15).forEach((item: any) => {
          const loc = item.location || "Europe / Remote";
          const country = detectCountry(loc);
          const exp = detectExpLevel(item.title, item.description || "");
          const dom = detectDomain(item.title, item.description || "");
          rawJobs.push({
            id: `arb-${item.slug || Date.now().toString(36)}`,
            title: item.title,
            company: item.company_name,
            location: loc,
            countryCode: country.code,
            countryFlag: country.flag,
            domainCategory: dom,
            type: item.remote ? "Remote" : "Hybrid",
            salary: exp.level === "Senior" ? "$130k–$190k" : "$90k–$140k",
            experience: exp.label,
            experienceLevel: exp.level,
            tech: item.tags && item.tags.length > 0 ? item.tags.slice(0, 5) : extractTech(item.title + " " + item.description),
            source: "Arbeitnow",
            sourceUrl: item.url || "https://www.arbeitnow.com",
            postedAt: "2d ago",
            visaSponsorship: item.visa_sponsorship || false,
            description: sanitizeHtmlText(item.description),
          });
        });
      }
    }
  } catch (err) {
    console.error("Arbeitnow fetch error:", err);
  }

  // 3. RemoteOK Live API
  try {
    const remoteOkRes = await secureFetch("https://remoteok.com/api", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      },
      allowedProvider: "custom"
    });

    if (remoteOkRes.ok) {
      const data = await remoteOkRes.json();
      if (Array.isArray(data)) {
        data.slice(1, 15).forEach((item: any) => {
          if (item?.position && item?.company) {
            const loc = item.location || "Worldwide Remote";
            const country = detectCountry(loc);
            const exp = detectExpLevel(item.position, item.description || "");
            const dom = detectDomain(item.position, item.description || "");
            rawJobs.push({
              id: `rok-${item.id || Date.now().toString(36)}`,
              title: item.position,
              company: item.company,
              location: loc,
              countryCode: country.code,
              countryFlag: country.flag,
              domainCategory: dom,
              type: "Remote",
              salary: item.salary_min && item.salary_max ? `$${Math.round(item.salary_min / 1000)}k–$${Math.round(item.salary_max / 1000)}k` : "$110k–$175k",
              experience: exp.label,
              experienceLevel: exp.level,
              tech: item.tags || ["React", "Node.js", "TypeScript"],
              source: "RemoteOK",
              sourceUrl: item.url || "https://remoteok.com",
              postedAt: item.date ? timeAgo(new Date(item.date)) : "1d ago",
              visaSponsorship: true,
              description: sanitizeHtmlText(item.description),
            });
          }
        });
      }
    }
  } catch (err) {
    console.error("RemoteOK fetch error:", err);
  }

  // 4. Greenhouse Public Boards (Cloudflare, Figma, Datadog)
  const greenhouseCompanies = ["cloudflare", "figma", "datadog"];
  for (const c of greenhouseCompanies) {
    try {
      const res = await secureFetch(`https://boards-api.greenhouse.io/v1/boards/${c}/jobs`, {
        allowedProvider: "custom"
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.jobs)) {
          data.slice(0, 10).forEach((item: any) => {
            const title = item.title || "";
            const loc = item.location?.name || "Remote / Worldwide";
            const country = detectCountry(loc);
            const exp = detectExpLevel(title, item.content || "");
            const dom = detectDomain(title, item.content || "");
            const companyName = c.charAt(0).toUpperCase() + c.slice(1);
            rawJobs.push({
              id: `gh-${c}-${item.id}`,
              title,
              company: companyName,
              location: loc,
              countryCode: country.code,
              countryFlag: country.flag,
              domainCategory: dom,
              type: loc.toLowerCase().includes("remote") ? "Remote" : "Hybrid",
              salary: title.toLowerCase().includes("senior") ? "$170k–$240k" : "$120k–$180k",
              experience: exp.label,
              experienceLevel: exp.level,
              tech: extractTech(title),
              source: `${companyName} Careers`,
              sourceUrl: item.absolute_url || `https://boards.greenhouse.io/${c}`,
              postedAt: "2d ago",
              visaSponsorship: true,
              description: `Join ${companyName} for ${title}. Location: ${loc}.`,
            });
          });
        }
      }
    } catch (err) {
      console.error(`Greenhouse fetch error for ${c}:`, err);
    }
  }

  // 5. Lever Public Boards (Vercel, Linear)
  const leverCompanies = ["vercel", "linear"];
  for (const l of leverCompanies) {
    try {
      const leverRes = await secureFetch(`https://api.lever.co/v0/postings/${l}?mode=json`, {
        allowedProvider: "custom"
      });
      if (leverRes.ok) {
        const data = await leverRes.json();
        if (Array.isArray(data)) {
          data.slice(0, 8).forEach((item: any) => {
            const title = item.title || "";
            const loc = item.categories?.location || "Worldwide Remote";
            const country = detectCountry(loc);
            const exp = detectExpLevel(title, item.description || "");
            const dom = detectDomain(title, item.description || "");
            const companyName = l.charAt(0).toUpperCase() + l.slice(1);
            rawJobs.push({
              id: `lev-${l}-${item.id}`,
              title,
              company: companyName,
              location: loc,
              countryCode: country.code,
              countryFlag: country.flag,
              domainCategory: dom,
              type: "Remote",
              salary: title.toLowerCase().includes("senior") ? "$180k–$250k" : "$130k–$190k",
              experience: exp.label,
              experienceLevel: exp.level,
              tech: extractTech(title + " " + (item.description || "")),
              source: `${companyName} Careers`,
              sourceUrl: item.hostedUrl || `https://jobs.lever.co/${l}`,
              postedAt: item.createdAt ? timeAgo(new Date(item.createdAt)) : "3d ago",
              visaSponsorship: true,
              description: sanitizeHtmlText(item.description),
            });
          });
        }
      }
    } catch (err) {
      console.error(`Lever fetch error for ${l}:`, err);
    }
  }

  // Filter rawJobs according to requested params
  let filtered = rawJobs.filter(job => {
    if (queryParam) {
      const matchQ = job.title.toLowerCase().includes(queryParam) ||
                     job.company.toLowerCase().includes(queryParam) ||
                     job.location.toLowerCase().includes(queryParam) ||
                     job.tech.some(t => t.toLowerCase().includes(queryParam));
      if (!matchQ) return false;
    }

    if (countryParam !== "all") {
      const loc = job.location.toLowerCase();
      const code = job.countryCode?.toLowerCase() || "";
      const isRemote = job.type === "Remote" || loc.includes("remote") || loc.includes("worldwide") || loc.includes("anywhere") || loc.includes("global");

      if (countryParam === "remote") {
        if (!isRemote) return false;
      } else if (countryParam === "in") {
        const isIn = code === "in" || loc.includes("india") || loc.includes("bengaluru") || loc.includes("bangalore") || loc.includes("delhi") || loc.includes("mumbai") || loc.includes("hyderabad") || loc.includes("pune") || loc.includes("gurgaon") || isRemote;
        if (!isIn) return false;
      } else if (countryParam === "us") {
        const isUs = code === "us" || loc.includes("us") || loc.includes("usa") || loc.includes("united states") || loc.includes("ca") || loc.includes("ny") || loc.includes("tx") || isRemote;
        if (!isUs) return false;
      } else if (countryParam === "uk") {
        const isUk = code === "uk" || loc.includes("uk") || loc.includes("united kingdom") || loc.includes("london") || loc.includes("manchester") || isRemote;
        if (!isUk) return false;
      } else if (countryParam === "ca") {
        const isCa = code === "ca" || loc.includes("canada") || loc.includes("toronto") || loc.includes("vancouver") || isRemote;
        if (!isCa) return false;
      } else if (countryParam === "de") {
        const isDe = code === "de" || loc.includes("germany") || loc.includes("berlin") || loc.includes("munich") || loc.includes("europe") || loc.includes("eu") || isRemote;
        if (!isDe) return false;
      }
    }

    if (domainParam !== "all") {
      if (domainParam === "software-engineer") {
        const isSoft = /software|engineer|developer|fullstack|backend|frontend|systems|architect|code/i.test(job.title + " " + (job.domainCategory || ""));
        if (!isSoft) return false;
      } else {
        const domKey = domainParam.replace("-engineer", "").replace("-manager", "").replace("-designer", "").replace("-", " ");
        const matchDom = job.domainCategory === domainParam ||
                         job.title.toLowerCase().includes(domKey) ||
                         (job.description && job.description.toLowerCase().includes(domKey));
        if (!matchDom) return false;
      }
    }

    if (experienceParam !== "all") {
      if (job.experienceLevel.toLowerCase() !== experienceParam) {
        return false;
      }
    }

    if (typeParam !== "All" && job.type !== typeParam) return false;
    if (visaParam && !job.visaSponsorship) return false;

    return true;
  });

  // Sanitize and escape string fields for security
  const cleanJobs = filtered.map(j => ({
    ...j,
    title: escapeHTML(j.title || ""),
    company: escapeHTML(j.company || ""),
    location: escapeHTML(j.location || ""),
    salary: j.salary ? escapeHTML(j.salary) : undefined,
    experience: escapeHTML(j.experience || ""),
    tech: (j.tech || []).map(t => escapeHTML(t)),
    source: escapeHTML(j.source || ""),
    postedAt: escapeHTML(j.postedAt || ""),
    description: j.description ? escapeHTML(j.description) : undefined,
  }));

  jobCache = { data: cleanJobs, timestamp: now, key: cacheKey };
  return NextResponse.json(cleanJobs);
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "just now";
}
