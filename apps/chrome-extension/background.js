// apps/chrome-extension/background.js

// Configure the extension to open the Side Panel when clicking the extension's action icon
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .then(() => {
      console.log("[Career Agents Background] Open panel on action click behavior configured successfully.");
    })
    .catch((err) => {
      console.error("[Career Agents Background] Error setting panel behavior:", err);
    });
});

// Listener for custom background messages or sync check intervals
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "ping_background") {
    sendResponse({ success: true, timestamp: Date.now() });
  }
  return true;
});
