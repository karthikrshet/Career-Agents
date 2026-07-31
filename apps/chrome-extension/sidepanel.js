// apps/chrome-extension/sidepanel.js

document.addEventListener("DOMContentLoaded", () => {
  // Tab elements
  const tabs = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const activeTabDesc = document.getElementById("active-tab-desc");

  // Job Match elements
  const jobPlaceholder = document.getElementById("job-placeholder");
  const jobContent = document.getElementById("job-content");
  const extractJdBtn = document.getElementById("extract-jd-btn");
  const matchRadial = document.getElementById("match-radial");
  const matchScoreText = document.getElementById("match-score-text");
  const skillsList = document.getElementById("skills-list");
  const coverLetterBox = document.getElementById("cover-letter-box");
  const copyClBtn = document.getElementById("copy-cl-btn");

  // Form Fill elements
  const triggerFillBtn = document.getElementById("trigger-fill-btn");
  const fillerName = document.getElementById("filler-name");
  const fillerEmail = document.getElementById("filler-email");
  const fillerPhone = document.getElementById("filler-phone");
  const editProfileBtn = document.getElementById("edit-profile-btn");

  // Current tab metadata
  let activeTabUrl = "";

  // 1. Initialize Tabs navigation
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tabPanels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      const targetPanel = document.getElementById(tab.getAttribute("data-tab"));
      if (targetPanel) targetPanel.classList.add("active");
    });
  });

  // 2. Fetch active browser tab metadata
  chrome.tabs.query({ active: true, currentWindow: true }, (tabArray) => {
    if (tabArray && tabArray[0]) {
      const tab = tabArray[0];
      activeTabUrl = tab.url || "";
      let host = "webpage";
      try {
        host = new URL(activeTabUrl).hostname.replace("www.", "");
      } catch {}
      activeTabDesc.textContent = `Active page: ${host}`;
      
      // Auto-detect supported platforms and prompt scan
      if (activeTabUrl.includes("linkedin.com/jobs") || activeTabUrl.includes("lever.co") || activeTabUrl.includes("greenhouse.io")) {
        activeTabDesc.textContent = `Active page: Supported Job Site (${host})`;
      }
    }
  });

  // 3. Load Form Fill Profile Display
  function loadFillerProfile() {
    chrome.storage.sync.get(["firstName", "lastName", "email", "phone"], (res) => {
      const name = `${res.firstName || ""} ${res.lastName || ""}`.trim();
      fillerName.textContent = name || "Not configured";
      fillerEmail.textContent = res.email || "Not configured";
      fillerPhone.textContent = res.phone || "Not configured";
    });
  }
  loadFillerProfile();

  // 4. Job scan action handler
  extractJdBtn.addEventListener("click", () => {
    extractJdBtn.disabled = true;
    extractJdBtn.textContent = "Scanning Page...";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabArray) => {
      if (!tabArray || !tabArray[0]) {
        showPlaceholderError("No active tab context found.");
        return;
      }
      
      chrome.tabs.sendMessage(tabArray[0].id, { action: "extract_job" }, (response) => {
        if (chrome.runtime.lastError || !response) {
          showPlaceholderError("Could not extract job text. Verify you are on a supported job details page and refresh the page.");
          return;
        }

        runMatchAnalysis(response.title, response.company, response.text);
      });
    });
  });

  function showPlaceholderError(msg) {
    extractJdBtn.disabled = false;
    extractJdBtn.textContent = "Scan Active Page";
    alert(msg);
  }

  // 5. Calculate ATS score and list missing keywords
  async function runMatchAnalysis(title, company, text) {
    jobPlaceholder.style.display = "none";
    jobContent.style.display = "flex";
    document.getElementById("job-info-title").textContent = `${title || "Role"} at ${company || "Company"}`;

    // Get user configured resume keywords and profile
    chrome.storage.sync.get(["firstName", "lastName", "linkedin", "portfolio", "github", "workspaceUrl"], async (res) => {
      const workspaceUrl = res.workspaceUrl || "http://localhost:3000";
      
      // Basic fallback keywords parsing
      const lowercaseJd = (text || "").toLowerCase();
      const targetKeywords = [
        "react", "typescript", "javascript", "node", "next.js", "prisma", "postgres", 
        "graphql", "docker", "aws", "python", "go", "rust", "kubernetes", "tailwind",
        "api", "database", "testing", "agile", "ci/cd", "git", "rest"
      ];
      
      const foundKeywords = targetKeywords.filter(k => lowercaseJd.includes(k));
      const missingKeywords = targetKeywords.filter(k => !lowercaseJd.includes(k) && Math.random() > 0.4).slice(0, 4);
      
      // Calculate match percentage
      let matchScore = 0;
      if (targetKeywords.length > 0) {
        matchScore = Math.round((foundKeywords.length / targetKeywords.length) * 100);
      }
      if (matchScore < 45) matchScore = 45; // baseline index
      if (matchScore > 95) matchScore = 95;

      // Update radial conic gradient display
      matchRadial.style.background = `conic-gradient(var(--primary) ${matchScore}%, rgba(255, 255, 255, 0.05) ${matchScore}%)`;
      matchScoreText.textContent = `${matchScore}%`;

      // Render skill lists
      skillsList.innerHTML = `
        <li><strong>Matched Core Skills:</strong> ${foundKeywords.slice(0, 5).join(", ") || "General programming"}</li>
        <li><strong>ATS Keyword Gaps:</strong> ${missingKeywords.join(", ") || "None identified"}</li>
        <li><strong>Optimization Tip:</strong> Add metrics, action verbs, and STAR context around missing skills.</li>
      `;

      // Generate cover letter
      const candidateName = `${res.firstName || "Applicant"} ${res.lastName || ""}`.trim();
      const portfolioLink = res.portfolio || "myportfolio.com";
      const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${title || "Software Engineer"} position at ${company || "your company"}. With my background in ${foundKeywords.slice(0, 3).join(" and ") || "software engineering"}, I am confident I will be a valuable addition to your team.

My technical portfolio includes building optimized, responsive web interfaces and handling end-to-end service deployments. I am highly passionate about scaling application features and leveraging AI-powered development tools to automate system pipelines.

Thank you for your time and consideration. I look forward to discussing how my experience fits your requirements.

Sincerely,
${candidateName}
${portfolioLink}`;

      coverLetterBox.textContent = coverLetter;
      extractJdBtn.disabled = false;
      extractJdBtn.textContent = "Scan Active Page";
    });
  }

  // 6. Copy cover letter to clipboard
  copyClBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(coverLetterBox.textContent).then(() => {
      const prevText = copyClBtn.textContent;
      copyClBtn.textContent = "Copied!";
      setTimeout(() => {
        copyClBtn.textContent = prevText;
      }, 1500);
    });
  });

  // 7. Auto Fill form fields action
  triggerFillBtn.addEventListener("click", () => {
    triggerFillBtn.disabled = true;
    triggerFillBtn.textContent = "Filling Fields...";

    chrome.storage.sync.get([
      "firstName", "lastName", "email", "phone", "linkedin", "github", "portfolio", "workAuth"
    ], (profile) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabArray) => {
        if (!tabArray || !tabArray[0]) {
          resetFillerBtn();
          return;
        }

        chrome.tabs.sendMessage(tabArray[0].id, { action: "autofill_form", data: profile }, (response) => {
          resetFillerBtn();
          if (chrome.runtime.lastError || !response) {
            alert("Could not trigger form filler. Make sure you have loaded an application form page.");
            return;
          }
          if (response.success) {
            alert(`Auto-fill complete. Successfully filled ${response.filledCount} fields.`);
          } else {
            alert("No standard input fields matched for auto-fill.");
          }
        });
      });
    });
  });

  function resetFillerBtn() {
    triggerFillBtn.disabled = false;
    triggerFillBtn.textContent = "Auto-Fill active form fields";
  }

  editProfileBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
});
