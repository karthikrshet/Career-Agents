# Security Hardening Checklist

Use this checklist during PR reviews and deployment audits:

- [x] **Network SSRF Check**: DNS resolution checks, redirect checks, private range check, IP URL rewrite.
- [x] **XSS Check**: All user-supplied fields must be escaped with `escapeHTML` before building templates.
- [x] **Property Injection Check**: Avoid `object[userInput]` constructs; validate keys against an allowed set.
- [x] **Dynamic Dispatch Check**: Statically resolve classes using switch-case, avoiding reflection.
- [x] **Log Injection Check**: Log output parameters must pass through `safeLogger` to strip control characters.
- [x] **Middleware Headers Check**: Confirm HSTS, CSP, Permissions, and X-Frame-Options are set.
- [x] **Extension Traversal Check**: Verify relative files check matches root folder bounds before atomic writing.
