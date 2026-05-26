// apps/chrome-extension/src/content/content.ts
import { JobDetails, AutofillProfile } from "../messaging/types";

function getJobMetadata(): JobDetails {
  let title = "";
  let company = "";
  let location = "";
  let text = "";

  const href = window.location.href;

  if (href.includes("linkedin.com/jobs")) {
    const titleEl = document.querySelector(".job-details-jobs-unified-top-card__job-title, h1") as HTMLElement;
    const companyEl = document.querySelector(".job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name") as HTMLElement;
    const locationEl = document.querySelector(".job-details-jobs-unified-top-card__primary-description span, .jobs-unified-top-card__bullet") as HTMLElement;
    const descEl = document.querySelector(".jobs-description-content__text, #job-details") as HTMLElement;

    title = titleEl?.innerText.trim() || "";
    company = companyEl?.innerText.trim() || "";
    location = locationEl?.innerText.trim() || "";
    text = descEl?.innerText.trim() || "";
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

function fillApplicationForm(profile: AutofillProfile): { success: boolean; filledCount: number } {
  let filledCount = 0;
  const inputs = document.querySelectorAll("input, select, textarea");

  inputs.forEach((element) => {
    const input = element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const id = (input.id || "").toLowerCase();
    const name = (input.name || "").toLowerCase();
    const placeholder = (input.placeholder || "").toLowerCase();

    let labelText = "";
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) labelText = (label as HTMLElement).innerText.toLowerCase();
    }

    const matches = (keywords: string[]) => {
      return keywords.some(kw => 
        id.includes(kw) || 
        name.includes(kw) || 
        placeholder.includes(kw) || 
        labelText.includes(kw)
      );
    };

    let fillValue: string | undefined = undefined;

    if (matches(["first_name", "firstname", "first name"]) && !matches(["last"])) {
      fillValue = profile.firstName;
    } else if (matches(["last_name", "lastname", "last name"])) {
      fillValue = profile.lastName;
    } else if (matches(["fullname", "full_name", "full name", "candidate_name", "candidate name"]) || (matches(["name"]) && !matches(["company", "school", "ref"]))) {
      fillValue = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
    } else if (input.type === "email" || matches(["email"])) {
      fillValue = profile.email;
    } else if (input.type === "tel" || matches(["phone", "mobile", "tel"])) {
      fillValue = profile.phone;
    } else if (matches(["linkedin"])) {
      fillValue = profile.linkedin;
    } else if (matches(["github"])) {
      fillValue = profile.github;
    } else if (matches(["portfolio", "website", "personal_website", "personal website"])) {
      fillValue = profile.portfolio;
    }

    if (fillValue) {
      input.value = fillValue;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
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
  }
  return true;
});
