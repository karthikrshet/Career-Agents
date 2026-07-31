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

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "PING_BACKGROUND") {
    sendResponse({ type: "PING_RESPONSE", payload: { active: true } });
  }
  return true;
});
