// apps/chrome-extension/src/background/background.ts

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .then(() => {
      console.log("[Career Agents Background] Side panel activated on action click.");
    })
    .catch((err) => {
      console.error("[Career Agents Background] Error setting panel behavior:", err);
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PING_BACKGROUND") {
    sendResponse({ type: "PING_RESPONSE", payload: { active: true } });
  } else if (message.type === "OPEN_SIDEPANEL") {
    if (sender.tab && sender.tab.id) {
      chrome.sidePanel.open({ tabId: sender.tab.id })
        .then(() => sendResponse({ success: true }))
        .catch((err) => sendResponse({ success: false, error: err.message }));
      return true;
    }
  }
  return true;
});
