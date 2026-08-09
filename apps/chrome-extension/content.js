// apps/chrome-extension/content.js

// Scrapes job details from the active page context
function extractJobDetails() {
  let title = "";
  let company = "";
  let text = "";

  // 1. LinkedIn unified jobs detail layout
  const linkedinTitle = document.querySelector(".job-details-jobs-unified-top-card__job-title, .jobs-unified-top-card__job-title, h1.t-24, h1");
  const linkedinCompany = document.querySelector(".job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name, .jobs-unified-top-card__subtitle a");
  const linkedinDescription = document.querySelector(".jobs-description-content__text, .jobs-description__container, #job-details");

  const host = window.location.hostname;
  if ((host.endsWith("linkedin.com") || host === "linkedin.com") && (linkedinTitle || linkedinDescription)) {
    title = linkedinTitle ? linkedinTitle.innerText.trim() : "";
    company = linkedinCompany ? linkedinCompany.innerText.trim() : "";
    text = linkedinDescription ? linkedinDescription.innerText.trim() : "";
  }
  // 2. Lever details page
  else if (host.endsWith("lever.co") || host === "lever.co") {
    const leverTitle = document.querySelector(".posting-header h2");
    const leverCompany = document.querySelector(".posting-header .company-logo") || { innerText: "Lever Posting" };
    const leverDesc = document.querySelector(".section.page-centered");
    
    title = leverTitle ? leverTitle.innerText.trim() : "";
    company = leverCompany ? leverCompany.innerText.trim() : "Lever Job";
    text = leverDesc ? leverDesc.innerText.trim() : "";
  }
  // 3. Greenhouse details page
  else if (host.endsWith("greenhouse.io") || host === "greenhouse.io") {
    const ghTitle = document.querySelector("#header h1");
    const ghCompany = document.querySelector(".company-name");
    const ghDesc = document.querySelector("#content");

    title = ghTitle ? ghTitle.innerText.trim() : "";
    company = ghCompany ? ghCompany.innerText.trim().replace("at ", "") : "Greenhouse Job";
    text = ghDesc ? ghDesc.innerText.trim() : "";
  }
  // 4. Fallback generic extractor
  else {
    const h1 = document.querySelector("h1");
    title = h1 ? h1.innerText.trim() : document.title;
    text = document.body.innerText.trim().slice(0, 10000); // baseline document snapshot
  }

  return { title, company, text };
}

// Auto-fills form inputs on Lever/Greenhouse job application forms
function autoFillForm(profile) {
  let filledCount = 0;
  const inputs = document.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    const id = (input.id || "").toLowerCase();
    const name = (input.name || "").toLowerCase();
    const placeholder = (input.placeholder || "").toLowerCase();
    
    // Find label if it exists
    let labelText = "";
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) labelText = label.innerText.toLowerCase();
    }

    const matches = (keywords) => {
      return keywords.some(kw => 
        id.includes(kw) || 
        name.includes(kw) || 
        placeholder.includes(kw) || 
        labelText.includes(kw)
      );
    };

    let valToFill = null;

    // First Name
    if (matches(["first_name", "firstname", "first name"]) && !matches(["last"])) {
      valToFill = profile.firstName;
    }
    // Last Name
    else if (matches(["last_name", "lastname", "last name"])) {
      valToFill = profile.lastName;
    }
    // Full Name
    else if (matches(["fullname", "full_name", "full name", "candidate_name", "candidate name"]) || (matches(["name"]) && !matches(["company", "school", "ref"]))) {
      valToFill = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
    }
    // Email
    else if (input.type === "email" || matches(["email", "email_address", "email address"])) {
      valToFill = profile.email;
    }
    // Phone
    else if (input.type === "tel" || matches(["phone", "mobile", "tel", "contact"])) {
      valToFill = profile.phone;
    }
    // LinkedIn
    else if (matches(["linkedin"])) {
      valToFill = profile.linkedin;
    }
    // GitHub
    else if (matches(["github"])) {
      valToFill = profile.github;
    }
    // Portfolio
    else if (matches(["portfolio", "website", "personal_website", "personal website"])) {
      valToFill = profile.portfolio;
    }
    // Work Authorization Dropdown
    else if (input.tagName === "SELECT" && matches(["authorization", "authorized", "sponsor", "visa"])) {
      if (profile.workAuth === "authorized") {
        // Attempt to select option containing 'yes' or 'authorized'
        Array.from(input.options).forEach((opt) => {
          const txt = opt.text.toLowerCase();
          if (txt.includes("yes") || txt.includes("authorized")) {
            input.value = opt.value;
            valToFill = opt.value;
          }
        });
      } else if (profile.workAuth === "visa_required") {
        Array.from(input.options).forEach((opt) => {
          const txt = opt.text.toLowerCase();
          if (txt.includes("sponsor") || txt.includes("require")) {
            input.value = opt.value;
            valToFill = opt.value;
          }
        });
      }
    }

    // Set value and dispatch native events to alert React/Vue bindings
    if (valToFill && input.tagName !== "SELECT") {
      input.value = valToFill;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      filledCount++;
    } else if (valToFill && input.tagName === "SELECT") {
      input.dispatchEvent(new Event("change", { bubbles: true }));
      filledCount++;
    }
  });

  return filledCount;
}

// Message receiver broker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extract_job") {
    const details = extractJobDetails();
    sendResponse(details);
  } else if (message.action === "autofill_form") {
    const filledCount = autoFillForm(message.data || {});
    sendResponse({ success: filledCount > 0, filledCount });
  }
  return true;
});
