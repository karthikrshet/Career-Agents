# Release Notes — Career Agents v3.0.1

This release implements security hardening and threat mitigations targeting SSRF vulnerabilities, rate-limiting improvements, and endpoint controls.

## Summary of Changes

- **SSRF Mitigation Network Layer**: Integrated a modular `packages/security` bundle enforcing host validations, DNS resolution audits, manual redirect tracking, and sensitive header sanitization.
- **Provider Endpoint Hardening**: Hardcoded model provider gateway calls to use predefined allowlist hosts and restricted dynamic overrides.
- **API Request & Rate Limiting**: Added token bucket limit policies and payload size checks across web routes.
- **Project Rebranding**: Completed global name transitions from "Career OS" to "Career Agents" across manifests, database configurations, type indexes, and documentation guides.

---

## Migration and Upgrade Notes

No database scheme migrations or breaking API parameters were introduced. Perform standard dependency installs after pulling down the release:
```bash
git checkout tags/v3.0.1
cd apps/web
npm install
npm run build
```
