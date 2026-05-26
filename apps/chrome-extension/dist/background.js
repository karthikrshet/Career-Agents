"use strict";
(() => {
  // src/background/background.ts
  chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).then(() => {
      console.log("[Career Agents Background] Side panel activated on action click.");
    }).catch((err) => {
      console.error("[Career Agents Background] Error setting panel behavior:", err);
    });
  });
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "PING_BACKGROUND") {
      sendResponse({ type: "PING_RESPONSE", payload: { active: true } });
    }
    return true;
  });
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL2JhY2tncm91bmQvYmFja2dyb3VuZC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gYXBwcy9jaHJvbWUtZXh0ZW5zaW9uL3NyYy9iYWNrZ3JvdW5kL2JhY2tncm91bmQudHNcblxuY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICBjaHJvbWUuc2lkZVBhbmVsLnNldFBhbmVsQmVoYXZpb3IoeyBvcGVuUGFuZWxPbkFjdGlvbkNsaWNrOiB0cnVlIH0pXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJbQ2FyZWVyIEFnZW50cyBCYWNrZ3JvdW5kXSBTaWRlIHBhbmVsIGFjdGl2YXRlZCBvbiBhY3Rpb24gY2xpY2suXCIpO1xuICAgIH0pXG4gICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJbQ2FyZWVyIEFnZW50cyBCYWNrZ3JvdW5kXSBFcnJvciBzZXR0aW5nIHBhbmVsIGJlaGF2aW9yOlwiLCBlcnIpO1xuICAgIH0pO1xufSk7XG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZSwgX3NlbmRlciwgc2VuZFJlc3BvbnNlKSA9PiB7XG4gIGlmIChtZXNzYWdlLnR5cGUgPT09IFwiUElOR19CQUNLR1JPVU5EXCIpIHtcbiAgICBzZW5kUmVzcG9uc2UoeyB0eXBlOiBcIlBJTkdfUkVTUE9OU0VcIiwgcGF5bG9hZDogeyBhY3RpdmU6IHRydWUgfSB9KTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7O0FBRUEsU0FBTyxRQUFRLFlBQVksWUFBWSxNQUFNO0FBQzNDLFdBQU8sVUFBVSxpQkFBaUIsRUFBRSx3QkFBd0IsS0FBSyxDQUFDLEVBQy9ELEtBQUssTUFBTTtBQUNWLGNBQVEsSUFBSSxrRUFBa0U7QUFBQSxJQUNoRixDQUFDLEVBQ0EsTUFBTSxDQUFDLFFBQVE7QUFDZCxjQUFRLE1BQU0sNERBQTRELEdBQUc7QUFBQSxJQUMvRSxDQUFDO0FBQUEsRUFDTCxDQUFDO0FBRUQsU0FBTyxRQUFRLFVBQVUsWUFBWSxDQUFDLFNBQVMsU0FBUyxpQkFBaUI7QUFDdkUsUUFBSSxRQUFRLFNBQVMsbUJBQW1CO0FBQ3RDLG1CQUFhLEVBQUUsTUFBTSxpQkFBaUIsU0FBUyxFQUFFLFFBQVEsS0FBSyxFQUFFLENBQUM7QUFBQSxJQUNuRTtBQUNBLFdBQU87QUFBQSxFQUNULENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
