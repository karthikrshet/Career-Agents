# Security Testing Verification

This document records the security tests run to verify vulnerability remediations.

## 1. SSRF & DNS Rebinding Tests
- Tested fetching standard external API domains: Successful.
- Tested fetching loopback addresses (`127.0.0.1`, `localhost`): Blocked with `ValidationError`.
- Tested fetching AWS metadata services (`169.254.169.254`): Blocked with `ValidationError`.

## 2. Reflected XSS Tests
- Submitted profile names with script tags (`<script>alert(1)</script>`) to the PDF/HTML generation endpoint: The script context was successfully broken and returned escaped (`&lt;script&gt;alert(1)&lt;/script&gt;`), rendering harmlessly as raw text.

## 3. Rate Limiting Tests
- Ran parallel curl requests on `/api/copilot`: Received `429 Too Many Requests` response after exceeding window constraints.
