// apps/chrome-extension/src/content/content.ts
import { JobDetails, AutofillProfile, CodeReviewPayload } from "../messaging/types";

function getJobMetadata(): JobDetails {
  let title = "";
  let company = "";
  let location = "";
  let text = "";

  const href = window.location.href;

  if (href.includes("linkedin.com")) {
    const titleEl = document.querySelector(".job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title, h1") as HTMLElement;
    const companyEl = document.querySelector(".job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name, .job-details-jobs-unified-top-card__primary-description a") as HTMLElement;
    const locationEl = document.querySelector(".job-details-jobs-unified-top-card__primary-description span, .jobs-unified-top-card__bullet, .job-details-jobs-unified-top-card__workplace-type") as HTMLElement;
    const descEl = document.querySelector(".jobs-description-content__text, #job-details, .jobs-box__html-content") as HTMLElement;

    title = titleEl?.innerText.trim() || document.title;
    company = companyEl?.innerText.trim() || "LinkedIn Employer";
    location = locationEl?.innerText.trim() || "";
    text = descEl?.innerText.trim() || document.body.innerText.slice(0, 8000);
  } else if (href.includes("greenhouse.io") || href.includes("lever.co")) {
    const titleEl = document.querySelector("h1, .app-title, .posting-header h2") as HTMLElement;
    const companyEl = document.querySelector(".company-name, .posting-header .company") as HTMLElement;
    const descEl = document.querySelector("#content, #main, .posting-page, .section-wrapper") as HTMLElement;

    title = titleEl?.innerText.trim() || document.title;
    company = companyEl?.innerText.trim() || "Target Employer";
    text = descEl?.innerText.trim() || document.body.innerText.slice(0, 8000);
  } else {
    const h1 = document.querySelector("h1") as HTMLElement;
    title = h1?.innerText.trim() || document.title;
    text = document.body.innerText.trim().slice(0, 8000);
  }

  return {
    title,
    company,
    location,
    text,
    url: href
  };
}

function getCodeProblemMetadata(): CodeReviewPayload {
  const href = window.location.href;
  let title = document.title;
  let problemText = "";
  let codeSnippet = "";
  let language = "python";

  if (href.includes("leetcode.com")) {
    const titleEl = document.querySelector("div[class*='title'], h4[data-cy='question-title'], .mr-2") as HTMLElement;
    if (titleEl) title = titleEl.innerText.trim();

    const descEl = document.querySelector("div[class*='elf-container'], div[data-track-load='description_content'], .description__2b0C") as HTMLElement;
    if (descEl) problemText = descEl.innerText.trim();

    const monacoLines = document.querySelectorAll(".view-line");
    if (monacoLines.length > 0) {
      codeSnippet = Array.from(monacoLines).map((line) => (line as HTMLElement).innerText).join("\n");
    }

    const langBtn = document.querySelector("button[id*='lang'], button[class*='lang']") as HTMLElement;
    if (langBtn) language = langBtn.innerText.toLowerCase();
  } else if (href.includes("hackerrank.com")) {
    const titleEl = document.querySelector(".page-label, .challenge-title") as HTMLElement;
    if (titleEl) title = titleEl.innerText.trim();

    const descEl = document.querySelector(".challenge-body-html, .problem-statement") as HTMLElement;
    if (descEl) problemText = descEl.innerText.trim();

    const codeEl = document.querySelector(".CodeMirror-code, .custom-input") as HTMLElement;
    if (codeEl) codeSnippet = codeEl.innerText.trim();
  }

  if (!problemText) {
    problemText = document.body.innerText.slice(0, 4000);
  }

  return {
    title,
    problemText,
    codeSnippet: codeSnippet || "# Write or paste candidate code solution here",
    language,
    url: href
  };
}

function fillApplicationForm(profile: AutofillProfile): { success: boolean; filledCount: number } {
  let filledCount = 0;
  const inputs = document.querySelectorAll("input, select, textarea, [contenteditable='true']");

  inputs.forEach((element) => {
    const input = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    if (input.type === "hidden" || input.type === "submit" || input.type === "button") return;

    const id = (input.id || "").toLowerCase();
    const name = (input.name || "").toLowerCase();
    const placeholder = (input.placeholder || "").toLowerCase();
    const ariaLabel = (input.getAttribute("aria-label") || "").toLowerCase();
    const autocomplete = (input.getAttribute("autocomplete") || "").toLowerCase();
    const dataAutomationId = (input.getAttribute("data-automation-id") || "").toLowerCase();

    let labelText = "";
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) labelText = (label as HTMLElement).innerText.toLowerCase();
    }
    if (!labelText && input.parentElement) {
      labelText = input.parentElement.innerText.toLowerCase();
    }

    const matches = (keywords: string[]) => {
      return keywords.some((kw) =>
        id.includes(kw) ||
        name.includes(kw) ||
        placeholder.includes(kw) ||
        ariaLabel.includes(kw) ||
        autocomplete.includes(kw) ||
        dataAutomationId.includes(kw) ||
        labelText.includes(kw)
      );
    };

    let fillValue: string | undefined = undefined;

    if (matches(["first_name", "firstname", "first name", "given-name"]) && !matches(["last"])) {
      fillValue = profile.firstName || "Karthik";
    } else if (matches(["last_name", "lastname", "last name", "family-name"])) {
      fillValue = profile.lastName || "Shet";
    } else if (matches(["fullname", "full_name", "full name", "candidate_name", "candidate name"]) || (matches(["name"]) && !matches(["company", "school", "ref", "user"]))) {
      fillValue = `${profile.firstName || "Karthik"} ${profile.lastName || "Shet"}`.trim();
    } else if (input.type === "email" || matches(["email", "mail"])) {
      fillValue = profile.email || "karthik@example.com";
    } else if (input.type === "tel" || matches(["phone", "mobile", "tel", "cell"])) {
      fillValue = profile.phone || "+1 555-0199";
    } else if (matches(["linkedin"])) {
      fillValue = profile.linkedin || "https://linkedin.com/in/karthikrshet";
    } else if (matches(["github"])) {
      fillValue = profile.github || "https://github.com/karthikrshet";
    } else if (matches(["portfolio", "website", "personal_website", "personal website", "url"])) {
      fillValue = profile.portfolio || "https://karthikrajeshshet.vercel.app";
    } else if (matches(["role", "current_role", "title", "headline", "job title"])) {
      fillValue = profile.currentRole || "Software Engineer";
    } else if (matches(["experience", "years_exp", "years of experience", "total experience"])) {
      fillValue = profile.yearsOfExperience || "4+ years";
    } else if (matches(["education", "degree", "school", "university", "college"])) {
      fillValue = profile.education || "B.S. in Computer Science";
    } else if (matches(["salary", "desired_salary", "compensation", "expected_salary", "pay"])) {
      fillValue = profile.expectedSalary || "$140,000 / year";
    } else if (matches(["authorization", "authorized", "work_auth", "legally"])) {
      fillValue = profile.workAuth || "Authorized to work";
    } else if (matches(["visa", "sponsor", "sponsorship"])) {
      fillValue = profile.visaSponsorship || "No sponsorship required";
    } else if (matches(["skill", "skills", "technologies", "tech stack"])) {
      fillValue = profile.primarySkills || "React, TypeScript, Node.js, Python, PostgreSQL, AWS";
    }

    if (fillValue) {
      if (input.tagName === "DIV" && input.getAttribute("contenteditable") === "true") {
        input.innerText = fillValue;
      } else {
        input.value = fillValue;
      }
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      input.dispatchEvent(new Event("blur", { bubbles: true }));
      filledCount++;
    }
  });

  return { success: filledCount > 0, filledCount };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "EXTRACT_JOB_REQUEST") {
    const payload = getJobMetadata();
    sendResponse({ type: "EXTRACT_JOB_RESPONSE", payload });
  } else if (message.type === "AUTOFILL_FORM_REQUEST") {
    const responsePayload = fillApplicationForm(message.payload);
    sendResponse({ type: "AUTOFILL_FORM_RESPONSE", payload: responsePayload });
  } else if (message.type === "EXTRACT_CODE_PROBLEM_REQUEST") {
    const payload = getCodeProblemMetadata();
    sendResponse({ type: "EXTRACT_CODE_PROBLEM_RESPONSE", payload });
  } else if (message.type === "EXTRACT_HIGHLIGHTED_TEXT_REQUEST") {
    const selectedText = window.getSelection()?.toString().trim() || "";
    sendResponse({ type: "EXTRACT_HIGHLIGHTED_TEXT_RESPONSE", payload: { text: selectedText } });
  }
  return true;
});
