"use strict";
(() => {
  // src/content/content.ts
  function getJobMetadata() {
    let title = "";
    let company = "";
    let location = "";
    let text = "";
    const href = window.location.href;
    if (href.includes("linkedin.com/jobs")) {
      const titleEl = document.querySelector(".job-details-jobs-unified-top-card__job-title, h1");
      const companyEl = document.querySelector(".job-details-jobs-unified-top-card__company-name, .jobs-unified-top-card__company-name");
      const locationEl = document.querySelector(".job-details-jobs-unified-top-card__primary-description span, .jobs-unified-top-card__bullet");
      const descEl = document.querySelector(".jobs-description-content__text, #job-details");
      title = titleEl?.innerText.trim() || "";
      company = companyEl?.innerText.trim() || "";
      location = locationEl?.innerText.trim() || "";
      text = descEl?.innerText.trim() || "";
    } else {
      const h1 = document.querySelector("h1");
      title = h1?.innerText.trim() || document.title;
      text = document.body.innerText.trim().slice(0, 8e3);
    }
    return {
      title,
      company,
      location,
      text,
      url: href
    };
  }
  function fillApplicationForm(profile) {
    let filledCount = 0;
    const inputs = document.querySelectorAll("input, select, textarea");
    inputs.forEach((element) => {
      const input = element;
      const id = (input.id || "").toLowerCase();
      const name = (input.name || "").toLowerCase();
      const placeholder = (input.placeholder || "").toLowerCase();
      let labelText = "";
      if (input.id) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label) labelText = label.innerText.toLowerCase();
      }
      const matches = (keywords) => {
        return keywords.some(
          (kw) => id.includes(kw) || name.includes(kw) || placeholder.includes(kw) || labelText.includes(kw)
        );
      };
      let fillValue = void 0;
      if (matches(["first_name", "firstname", "first name"]) && !matches(["last"])) {
        fillValue = profile.firstName;
      } else if (matches(["last_name", "lastname", "last name"])) {
        fillValue = profile.lastName;
      } else if (matches(["fullname", "full_name", "full name", "candidate_name", "candidate name"]) || matches(["name"]) && !matches(["company", "school", "ref"])) {
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
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL2NvbnRlbnQvY29udGVudC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiLy8gYXBwcy9jaHJvbWUtZXh0ZW5zaW9uL3NyYy9jb250ZW50L2NvbnRlbnQudHNcbmltcG9ydCB7IEpvYkRldGFpbHMsIEF1dG9maWxsUHJvZmlsZSB9IGZyb20gXCIuLi9tZXNzYWdpbmcvdHlwZXNcIjtcblxuZnVuY3Rpb24gZ2V0Sm9iTWV0YWRhdGEoKTogSm9iRGV0YWlscyB7XG4gIGxldCB0aXRsZSA9IFwiXCI7XG4gIGxldCBjb21wYW55ID0gXCJcIjtcbiAgbGV0IGxvY2F0aW9uID0gXCJcIjtcbiAgbGV0IHRleHQgPSBcIlwiO1xuXG4gIGNvbnN0IGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblxuICBpZiAoaHJlZi5pbmNsdWRlcyhcImxpbmtlZGluLmNvbS9qb2JzXCIpKSB7XG4gICAgY29uc3QgdGl0bGVFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuam9iLWRldGFpbHMtam9icy11bmlmaWVkLXRvcC1jYXJkX19qb2ItdGl0bGUsIGgxXCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIGNvbnN0IGNvbXBhbnlFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuam9iLWRldGFpbHMtam9icy11bmlmaWVkLXRvcC1jYXJkX19jb21wYW55LW5hbWUsIC5qb2JzLXVuaWZpZWQtdG9wLWNhcmRfX2NvbXBhbnktbmFtZVwiKSBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBsb2NhdGlvbkVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5qb2ItZGV0YWlscy1qb2JzLXVuaWZpZWQtdG9wLWNhcmRfX3ByaW1hcnktZGVzY3JpcHRpb24gc3BhbiwgLmpvYnMtdW5pZmllZC10b3AtY2FyZF9fYnVsbGV0XCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIGNvbnN0IGRlc2NFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuam9icy1kZXNjcmlwdGlvbi1jb250ZW50X190ZXh0LCAjam9iLWRldGFpbHNcIikgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgICB0aXRsZSA9IHRpdGxlRWw/LmlubmVyVGV4dC50cmltKCkgfHwgXCJcIjtcbiAgICBjb21wYW55ID0gY29tcGFueUVsPy5pbm5lclRleHQudHJpbSgpIHx8IFwiXCI7XG4gICAgbG9jYXRpb24gPSBsb2NhdGlvbkVsPy5pbm5lclRleHQudHJpbSgpIHx8IFwiXCI7XG4gICAgdGV4dCA9IGRlc2NFbD8uaW5uZXJUZXh0LnRyaW0oKSB8fCBcIlwiO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGgxID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImgxXCIpIGFzIEhUTUxFbGVtZW50O1xuICAgIHRpdGxlID0gaDE/LmlubmVyVGV4dC50cmltKCkgfHwgZG9jdW1lbnQudGl0bGU7XG4gICAgdGV4dCA9IGRvY3VtZW50LmJvZHkuaW5uZXJUZXh0LnRyaW0oKS5zbGljZSgwLCA4MDAwKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdGl0bGUsXG4gICAgY29tcGFueSxcbiAgICBsb2NhdGlvbixcbiAgICB0ZXh0LFxuICAgIHVybDogaHJlZlxuICB9O1xufVxuXG5mdW5jdGlvbiBmaWxsQXBwbGljYXRpb25Gb3JtKHByb2ZpbGU6IEF1dG9maWxsUHJvZmlsZSk6IHsgc3VjY2VzczogYm9vbGVhbjsgZmlsbGVkQ291bnQ6IG51bWJlciB9IHtcbiAgbGV0IGZpbGxlZENvdW50ID0gMDtcbiAgY29uc3QgaW5wdXRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImlucHV0LCBzZWxlY3QsIHRleHRhcmVhXCIpO1xuXG4gIGlucHV0cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSBlbGVtZW50IGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBIVE1MU2VsZWN0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XG4gICAgY29uc3QgaWQgPSAoaW5wdXQuaWQgfHwgXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBuYW1lID0gKGlucHV0Lm5hbWUgfHwgXCJcIikudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBwbGFjZWhvbGRlciA9IChpbnB1dC5wbGFjZWhvbGRlciB8fCBcIlwiKS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgbGV0IGxhYmVsVGV4dCA9IFwiXCI7XG4gICAgaWYgKGlucHV0LmlkKSB7XG4gICAgICBjb25zdCBsYWJlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGxhYmVsW2Zvcj1cIiR7aW5wdXQuaWR9XCJdYCk7XG4gICAgICBpZiAobGFiZWwpIGxhYmVsVGV4dCA9IChsYWJlbCBhcyBIVE1MRWxlbWVudCkuaW5uZXJUZXh0LnRvTG93ZXJDYXNlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgbWF0Y2hlcyA9IChrZXl3b3Jkczogc3RyaW5nW10pID0+IHtcbiAgICAgIHJldHVybiBrZXl3b3Jkcy5zb21lKGt3ID0+IFxuICAgICAgICBpZC5pbmNsdWRlcyhrdykgfHwgXG4gICAgICAgIG5hbWUuaW5jbHVkZXMoa3cpIHx8IFxuICAgICAgICBwbGFjZWhvbGRlci5pbmNsdWRlcyhrdykgfHwgXG4gICAgICAgIGxhYmVsVGV4dC5pbmNsdWRlcyhrdylcbiAgICAgICk7XG4gICAgfTtcblxuICAgIGxldCBmaWxsVmFsdWU6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcblxuICAgIGlmIChtYXRjaGVzKFtcImZpcnN0X25hbWVcIiwgXCJmaXJzdG5hbWVcIiwgXCJmaXJzdCBuYW1lXCJdKSAmJiAhbWF0Y2hlcyhbXCJsYXN0XCJdKSkge1xuICAgICAgZmlsbFZhbHVlID0gcHJvZmlsZS5maXJzdE5hbWU7XG4gICAgfSBlbHNlIGlmIChtYXRjaGVzKFtcImxhc3RfbmFtZVwiLCBcImxhc3RuYW1lXCIsIFwibGFzdCBuYW1lXCJdKSkge1xuICAgICAgZmlsbFZhbHVlID0gcHJvZmlsZS5sYXN0TmFtZTtcbiAgICB9IGVsc2UgaWYgKG1hdGNoZXMoW1wiZnVsbG5hbWVcIiwgXCJmdWxsX25hbWVcIiwgXCJmdWxsIG5hbWVcIiwgXCJjYW5kaWRhdGVfbmFtZVwiLCBcImNhbmRpZGF0ZSBuYW1lXCJdKSB8fCAobWF0Y2hlcyhbXCJuYW1lXCJdKSAmJiAhbWF0Y2hlcyhbXCJjb21wYW55XCIsIFwic2Nob29sXCIsIFwicmVmXCJdKSkpIHtcbiAgICAgIGZpbGxWYWx1ZSA9IGAke3Byb2ZpbGUuZmlyc3ROYW1lIHx8IFwiXCJ9ICR7cHJvZmlsZS5sYXN0TmFtZSB8fCBcIlwifWAudHJpbSgpO1xuICAgIH0gZWxzZSBpZiAoaW5wdXQudHlwZSA9PT0gXCJlbWFpbFwiIHx8IG1hdGNoZXMoW1wiZW1haWxcIl0pKSB7XG4gICAgICBmaWxsVmFsdWUgPSBwcm9maWxlLmVtYWlsO1xuICAgIH0gZWxzZSBpZiAoaW5wdXQudHlwZSA9PT0gXCJ0ZWxcIiB8fCBtYXRjaGVzKFtcInBob25lXCIsIFwibW9iaWxlXCIsIFwidGVsXCJdKSkge1xuICAgICAgZmlsbFZhbHVlID0gcHJvZmlsZS5waG9uZTtcbiAgICB9IGVsc2UgaWYgKG1hdGNoZXMoW1wibGlua2VkaW5cIl0pKSB7XG4gICAgICBmaWxsVmFsdWUgPSBwcm9maWxlLmxpbmtlZGluO1xuICAgIH0gZWxzZSBpZiAobWF0Y2hlcyhbXCJnaXRodWJcIl0pKSB7XG4gICAgICBmaWxsVmFsdWUgPSBwcm9maWxlLmdpdGh1YjtcbiAgICB9IGVsc2UgaWYgKG1hdGNoZXMoW1wicG9ydGZvbGlvXCIsIFwid2Vic2l0ZVwiLCBcInBlcnNvbmFsX3dlYnNpdGVcIiwgXCJwZXJzb25hbCB3ZWJzaXRlXCJdKSkge1xuICAgICAgZmlsbFZhbHVlID0gcHJvZmlsZS5wb3J0Zm9saW87XG4gICAgfVxuXG4gICAgaWYgKGZpbGxWYWx1ZSkge1xuICAgICAgaW5wdXQudmFsdWUgPSBmaWxsVmFsdWU7XG4gICAgICBpbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIsIHsgYnViYmxlczogdHJ1ZSB9KSk7XG4gICAgICBpbnB1dC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImNoYW5nZVwiLCB7IGJ1YmJsZXM6IHRydWUgfSkpO1xuICAgICAgZmlsbGVkQ291bnQrKztcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7IHN1Y2Nlc3M6IGZpbGxlZENvdW50ID4gMCwgZmlsbGVkQ291bnQgfTtcbn1cblxuY2hyb21lLnJ1bnRpbWUub25NZXNzYWdlLmFkZExpc3RlbmVyKChtZXNzYWdlLCBfc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gXCJFWFRSQUNUX0pPQl9SRVFVRVNUXCIpIHtcbiAgICBjb25zdCBwYXlsb2FkID0gZ2V0Sm9iTWV0YWRhdGEoKTtcbiAgICBzZW5kUmVzcG9uc2UoeyB0eXBlOiBcIkVYVFJBQ1RfSk9CX1JFU1BPTlNFXCIsIHBheWxvYWQgfSk7XG4gIH0gZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSBcIkFVVE9GSUxMX0ZPUk1fUkVRVUVTVFwiKSB7XG4gICAgY29uc3QgcmVzcG9uc2VQYXlsb2FkID0gZmlsbEFwcGxpY2F0aW9uRm9ybShtZXNzYWdlLnBheWxvYWQpO1xuICAgIHNlbmRSZXNwb25zZSh7IHR5cGU6IFwiQVVUT0ZJTExfRk9STV9SRVNQT05TRVwiLCBwYXlsb2FkOiByZXNwb25zZVBheWxvYWQgfSk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7OztBQUdBLFdBQVMsaUJBQTZCO0FBQ3BDLFFBQUksUUFBUTtBQUNaLFFBQUksVUFBVTtBQUNkLFFBQUksV0FBVztBQUNmLFFBQUksT0FBTztBQUVYLFVBQU0sT0FBTyxPQUFPLFNBQVM7QUFFN0IsUUFBSSxLQUFLLFNBQVMsbUJBQW1CLEdBQUc7QUFDdEMsWUFBTSxVQUFVLFNBQVMsY0FBYyxtREFBbUQ7QUFDMUYsWUFBTSxZQUFZLFNBQVMsY0FBYyx3RkFBd0Y7QUFDakksWUFBTSxhQUFhLFNBQVMsY0FBYyw4RkFBOEY7QUFDeEks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
