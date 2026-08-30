// apps/chrome-extension/src/content/content.ts
import {
  JobDetails,
  AutofillProfile,
  CodeReviewPayload,
  LinkedInProfilePayload,
  GitHubRepoPayload,
  ExtensionMessage,
} from "../messaging/types";

function hasHostnameMatch(urlStr: string, domains: string[]): boolean {
  try {
    const hostname = new URL(urlStr).hostname.toLowerCase();
    return domains.some((d) => hostname === d || hostname.endsWith("." + d));
  } catch {
    return false;
  }
}

// 1. Scrape Job Postings
function getJobMetadata(): JobDetails {
  let title = "";
  let company = "";
  let location = "";
  let salary = "";
  let text = "";
  const href = window.location.href;

  if (hasHostnameMatch(href, ["linkedin.com"])) {
    const titleEl = document.querySelector(
      ".job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title, .jobs-details__main-content h1, h1"
    ) as HTMLElement;
    const companyEl = document.querySelector(
      ".job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name, .jobs-details__main-content a"
    ) as HTMLElement;
    const locationEl = document.querySelector(
      ".job-details-jobs-unified-top-card__primary-description span, .jobs-unified-top-card__bullet, .job-details-jobs-unified-top-card__workplace-type"
    ) as HTMLElement;
    const descEl = document.querySelector(
      ".jobs-description-content__text, #job-details, .jobs-box__html-content"
    ) as HTMLElement;

    title = titleEl?.innerText.trim() || document.title;
    company = companyEl?.innerText.trim() || "LinkedIn Employer";
    location = locationEl?.innerText.trim() || "";
    text = descEl?.innerText.trim() || document.body.innerText.slice(0, 10000);
  } else if (hasHostnameMatch(href, ["greenhouse.io", "boards.greenhouse.io"])) {
    const titleEl = document.querySelector("h1, .app-title, .posting-header h2") as HTMLElement;
    const companyEl = document.querySelector(".company-name, .posting-header .company, #header .company-name") as HTMLElement;
    const locationEl = document.querySelector(".location, .body--metadata") as HTMLElement;
    const descEl = document.querySelector("#content, #main, .posting-page, #app_body") as HTMLElement;

    title = titleEl?.innerText.trim() || document.title;
    company = companyEl?.innerText.trim() || "Greenhouse Employer";
    location = locationEl?.innerText.trim() || "";
    text = descEl?.innerText.trim() || document.body.innerText.slice(0, 10000);
  } else if (hasHostnameMatch(href, ["lever.co", "jobs.lever.co"])) {
    const titleEl = document.querySelector(".posting-headline h2, h2") as HTMLElement;
    const companyEl = document.querySelector(".main-header-logo, .posting-headline") as HTMLElement;
    const locationEl = document.querySelector(".workplaceTypes, .location") as HTMLElement;
    const descEl = document.querySelector(".posting-page, .section-wrapper") as HTMLElement;

    title = titleEl?.innerText.trim() || document.title;
    company = companyEl?.innerText.trim() || "Lever Employer";
    location = locationEl?.innerText.trim() || "";
    text = descEl?.innerText.trim() || document.body.innerText.slice(0, 10000);
  } else if (hasHostnameMatch(href, ["ashbyhq.com", "jobs.ashbyhq.com"])) {
    const titleEl = document.querySelector("h1, .ashby-job-posting-heading") as HTMLElement;
    const descEl = document.querySelector(".ashby-job-posting-description, #job-description") as HTMLElement;

    title = titleEl?.innerText.trim() || document.title;
    company = document.title.split("-")[0]?.trim() || "Ashby Employer";
    text = descEl?.innerText.trim() || document.body.innerText.slice(0, 10000);
  } else if (hasHostnameMatch(href, ["myworkdayjobs.com", "workday.com"])) {
    const titleEl = document.querySelector("h2[data-automation-id='jobPostingHeader'], h1") as HTMLElement;
    const locationEl = document.querySelector("[data-automation-id='locations'], [data-automation-id='jobPostingLocation']") as HTMLElement;
    const descEl = document.querySelector("[data-automation-id='jobPostingDescription']") as HTMLElement;

    title = titleEl?.innerText.trim() || document.title;
    company = document.title.split("-")[0]?.trim() || "Workday Employer";
    location = locationEl?.innerText.trim() || "";
    text = descEl?.innerText.trim() || document.body.innerText.slice(0, 10000);
  } else if (hasHostnameMatch(href, ["indeed.com"])) {
    const titleEl = document.querySelector(".jobsearch-JobInfoHeader-title, h1") as HTMLElement;
    const companyEl = document.querySelector("[data-company-name='true'], .jobsearch-InlineCompanyRating-companyHeader") as HTMLElement;
    const locationEl = document.querySelector("[data-testid='inlineHeader-companyLocation']") as HTMLElement;
    const descEl = document.querySelector("#jobDescriptionText") as HTMLElement;

    title = titleEl?.innerText.trim() || document.title;
    company = companyEl?.innerText.trim() || "Indeed Employer";
    location = locationEl?.innerText.trim() || "";
    text = descEl?.innerText.trim() || document.body.innerText.slice(0, 10000);
  } else {
    const h1 = document.querySelector("h1") as HTMLElement;
    title = h1?.innerText.trim() || document.title;
    company = document.title.split("|")[0]?.split("-")[0]?.trim() || "Target Company";
    text = document.body.innerText.trim().slice(0, 10000);
  }

  return { title, company, location, salary, text, url: href };
}

// 2. Scrape LeetCode / Coding Arena Problems
function getCodeProblemMetadata(): CodeReviewPayload {
  const href = window.location.href;
  let title = document.title;
  let problemText = "";
  let codeSnippet = "";
  let language = "typescript";

  if (hasHostnameMatch(href, ["leetcode.com"])) {
    const titleEl = document.querySelector("div[class*='title'], h4[data-cy='question-title'], .mr-2") as HTMLElement;
    if (titleEl) title = titleEl.innerText.trim();

    const descEl = document.querySelector("div[class*='elf-container'], div[data-track-load='description_content'], .description__2b0C") as HTMLElement;
    if (descEl) problemText = descEl.innerText.trim();

    const monacoLines = document.querySelectorAll(".view-line");
    if (monacoLines.length > 0) {
      codeSnippet = Array.from(monacoLines)
        .map((line) => (line as HTMLElement).innerText)
        .join("\n");
    }

    const langBtn = document.querySelector("button[id*='lang'], button[class*='lang']") as HTMLElement;
    if (langBtn) language = langBtn.innerText.toLowerCase();
  } else if (hasHostnameMatch(href, ["hackerrank.com"])) {
    const titleEl = document.querySelector(".page-label, .challenge-title") as HTMLElement;
    if (titleEl) title = titleEl.innerText.trim();

    const descEl = document.querySelector(".challenge-body-html, .problem-statement") as HTMLElement;
    if (descEl) problemText = descEl.innerText.trim();

    const codeEl = document.querySelector(".CodeMirror-code, .custom-input") as HTMLElement;
    if (codeEl) codeSnippet = codeEl.innerText.trim();
  }

  if (!problemText) {
    problemText = document.body.innerText.slice(0, 5000);
  }

  return {
    title,
    problemText,
    codeSnippet: codeSnippet || "// Write or paste solution code here",
    language,
    url: href,
  };
}

// 3. Scrape LinkedIn Profile
function getLinkedInProfileMetadata(): LinkedInProfilePayload {
  let name = "";
  let headline = "";
  let about = "";

  const nameEl = document.querySelector("h1, .text-heading-xlarge") as HTMLElement;
  const headlineEl = document.querySelector(".text-body-medium.break-words, .pv-text-details__left-panel h2") as HTMLElement;
  const aboutEl = document.querySelector(".display-flex.ph5.pv3 span[aria-hidden='true'], #about ~ .display-flex span") as HTMLElement;

  name = nameEl?.innerText.trim() || document.title.split("|")[0]?.trim() || "Candidate";
  headline = headlineEl?.innerText.trim() || "";
  about = aboutEl?.innerText.trim() || "";

  return { name, headline, about, url: window.location.href };
}

// 4. Scrape GitHub Repository
function getGitHubRepoMetadata(): GitHubRepoPayload {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const owner = parts[0] || "owner";
  const name = parts[1] || "repository";

  const descEl = document.querySelector("p.f4.my-3, [data-pjax='#repo-content-pjax-container'] p") as HTMLElement;
  const langEl = document.querySelector("span.color-fg-default.text-bold.mr-1") as HTMLElement;
  const starsEl = document.querySelector("#repo-stars-counter-star, .js-social-count") as HTMLElement;
  const forksEl = document.querySelector("#repo-network-counter, a[href*='forks'] .Counter") as HTMLElement;
  const readmeEl = document.querySelector("article.markdown-body, #readme") as HTMLElement;

  const stars = parseInt(starsEl?.innerText.replace(/[^0-9]/g, "") || "0", 10);
  const forks = parseInt(forksEl?.innerText.replace(/[^0-9]/g, "") || "0", 10);

  return {
    owner,
    name,
    description: descEl?.innerText.trim() || "",
    language: langEl?.innerText.trim() || "TypeScript",
    stars: isNaN(stars) ? 0 : stars,
    forks: isNaN(forks) ? 0 : forks,
    readmeText: readmeEl?.innerText.slice(0, 6000) || "",
    url: window.location.href,
  };
}

// 5. Smart Form Autofill
function fillApplicationForm(profile: AutofillProfile): { success: boolean; filledCount: number } {
  let filledCount = 0;
  const inputs = Array.from(document.querySelectorAll("input, textarea, select"));

  inputs.forEach((inputEl) => {
    const el = inputEl as HTMLInputElement | HTMLTextAreaElement;
    const name = (el.name || "").toLowerCase();
    const id = (el.id || "").toLowerCase();
    const placeholder = (el.placeholder || "").toLowerCase();
    const label = el.labels && el.labels[0] ? el.labels[0].innerText.toLowerCase() : "";
    const combined = `${name} ${id} ${placeholder} ${label}`;

    let val = "";
    if (combined.includes("first") && (combined.includes("name") || combined.includes("given"))) {
      val = profile.firstName || profile.fullName?.split(" ")[0] || "";
    } else if (combined.includes("last") && (combined.includes("name") || combined.includes("family") || combined.includes("sur"))) {
      val = profile.lastName || profile.fullName?.split(" ").slice(1).join(" ") || "";
    } else if (combined.includes("full") && combined.includes("name") || (name === "name" && !combined.includes("user"))) {
      val = profile.fullName || `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
    } else if (combined.includes("email")) {
      val = profile.email || "";
    } else if (combined.includes("phone") || combined.includes("mobile") || combined.includes("tel")) {
      val = profile.phone || "";
    } else if (combined.includes("linkedin")) {
      val = profile.linkedin || "";
    } else if (combined.includes("github")) {
      val = profile.github || "";
    } else if (combined.includes("portfolio") || combined.includes("website") || combined.includes("personal_url")) {
      val = profile.portfolio || "";
    } else if (combined.includes("city") || combined.includes("location") || combined.includes("address")) {
      val = profile.location || "";
    }

    if (val && el.type !== "hidden" && el.type !== "submit" && el.type !== "radio" && el.type !== "checkbox") {
      el.value = val;
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
      filledCount++;
    }
  });

  return { success: filledCount > 0, filledCount };
}

// Listen for messages from Sidepanel & Popup
chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender, sendResponse) => {
  if (message.type === "EXTRACT_JOB_REQUEST") {
    sendResponse({ type: "EXTRACT_JOB_RESPONSE", payload: getJobMetadata() });
  } else if (message.type === "EXTRACT_CODE_PROBLEM_REQUEST") {
    sendResponse({ type: "EXTRACT_CODE_PROBLEM_RESPONSE", payload: getCodeProblemMetadata() });
  } else if (message.type === "EXTRACT_LINKEDIN_REQUEST") {
    sendResponse({ type: "EXTRACT_LINKEDIN_RESPONSE", payload: getLinkedInProfileMetadata() });
  } else if (message.type === "EXTRACT_GITHUB_REPO_REQUEST") {
    sendResponse({ type: "EXTRACT_GITHUB_REPO_RESPONSE", payload: getGitHubRepoMetadata() });
  } else if (message.type === "AUTOFILL_FORM_REQUEST") {
    const result = fillApplicationForm(message.payload || {});
    sendResponse({ type: "AUTOFILL_FORM_RESPONSE", payload: result });
  }
  return true;
});
