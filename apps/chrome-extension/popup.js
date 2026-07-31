// apps/chrome-extension/popup.js

document.addEventListener("DOMContentLoaded", () => {
  const connDot = document.getElementById("conn-dot");
  const connText = document.getElementById("conn-text");
  const openPanelBtn = document.getElementById("open-panel-btn");
  const dashboardBtn = document.getElementById("dashboard-btn");
  const optionsBtn = document.getElementById("options-btn");

  // Load target endpoint URL from sync preferences, defaulting to localhost:3000
  chrome.storage.sync.get(["workspaceUrl"], (res) => {
    const workspaceUrl = res.workspaceUrl || "http://localhost:3000";
    checkConnection(workspaceUrl);
  });

  // Verify connection to the workspace
  async function checkConnection(url) {
    try {
      const response = await fetch(`${url}/api/system/health`);
      if (response.ok) {
        connDot.className = "status-dot connected";
        connText.textContent = "Connected";
      } else {
        throw new Error("Offline");
      }
    } catch {
      connDot.className = "status-dot disconnected";
      connText.textContent = "Offline";
    }
  }

  // Action listeners
  openPanelBtn.addEventListener("click", async () => {
    // Open the side panel inside the current window
    chrome.windows.getCurrent((win) => {
      chrome.sidePanel.open({ windowId: win.id });
      window.close(); // Close the popup
    });
  });

  dashboardBtn.addEventListener("click", () => {
    chrome.storage.sync.get(["workspaceUrl"], (res) => {
      const workspaceUrl = res.workspaceUrl || "http://localhost:3000";
      chrome.tabs.create({ url: `${workspaceUrl}/dashboard` });
    });
  });

  optionsBtn.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
});
