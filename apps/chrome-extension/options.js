// apps/chrome-extension/options.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("options-form");
  const alertBox = document.getElementById("status-alert");

  const fields = [
    "workspaceUrl",
    "firstName",
    "lastName",
    "email",
    "phone",
    "linkedin",
    "github",
    "portfolio",
    "workAuth"
  ];

  // Load configured preferences
  chrome.storage.sync.get(fields, (res) => {
    document.getElementById("workspace-url").value = res.workspaceUrl || "http://localhost:3000";
    document.getElementById("first-name").value = res.firstName || "";
    document.getElementById("last-name").value = res.lastName || "";
    document.getElementById("email").value = res.email || "";
    document.getElementById("phone").value = res.phone || "";
    document.getElementById("linkedin").value = res.linkedin || "";
    document.getElementById("github").value = res.github || "";
    document.getElementById("portfolio").value = res.portfolio || "";
    document.getElementById("work-auth").value = res.workAuth || "authorized";
  });

  // Save updated preferences
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      workspaceUrl: document.getElementById("workspace-url").value.trim(),
      firstName: document.getElementById("first-name").value.trim(),
      lastName: document.getElementById("last-name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      linkedin: document.getElementById("linkedin").value.trim(),
      github: document.getElementById("github").value.trim(),
      portfolio: document.getElementById("portfolio").value.trim(),
      workAuth: document.getElementById("work-auth").value
    };

    chrome.storage.sync.set(data, () => {
      alertBox.className = "alert alert-success";
      alertBox.textContent = "Preferences saved successfully!";
      alertBox.style.display = "block";

      setTimeout(() => {
        alertBox.style.display = "none";
      }, 3000);
    });
  });
});
// 
