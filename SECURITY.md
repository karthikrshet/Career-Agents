# Security Policy

We take the security of Career-Agents seriously. We appreciate your efforts to report vulnerabilities responsibly.

> [!IMPORTANT]
> **Security vulnerabilities MUST NOT be reported publicly.** Do NOT open public issues or pull requests containing exploit code or outlining active security flaws.

---

## 🔒 Private Disclosure Process

If you discover a security vulnerability, please report it through one of the following private channels:

1. **GitHub Private Vulnerability Reporting:**
   - Navigate to the repository page on GitHub.
   - Click on the **Security** tab.
   - Under **Vulnerability reporting**, click **Report a vulnerability** to submit a draft advisory privately.
2. **Direct Email:**
   - Email our lead maintainer directly at **kartikrshet@gmail.com**.
   - Please encrypt sensitive details or supply a reproducible proof-of-concept (PoC).

---

## 🚨 Severity Levels & Triage SLA

Upon receiving a report, we triage issues according to the following severity definitions:

| Severity | Definition | Target Triage Time |
| :--- | :--- | :--- |
| **Critical** | Remote code execution, arbitrary command injections, API key extraction from CLI tools. | Within 24 hours |
| **High** | Privilege escalations in local environments, unauthenticated access routes in SDK helpers. | Within 48 hours |
| **Medium** | Path traversal, unexpected local system file writes outside exports. | Within 5 days |
| **Low** | Denial of service, parsing crashes on malformed inputs. | Within 7 days |

---

## 📅 Response & Triage SLA

1. **Acknowledgement:** We will acknowledge receipt of your vulnerability report within **48 hours**.
2. **Triage:** We will work with you to analyze and confirm the issue.
3. **Resolution:** We target releasing a fix for critical/high security issues within **7-14 days** of triage.
4. **Coordinated Disclosure:** We request that you do not publicize details of the security vulnerability until we have patched it and updated the repository release version. Once patched, we will publish a security advisory and attribute credit to the discoverer.
