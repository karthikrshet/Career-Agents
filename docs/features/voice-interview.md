# AI Voice Agent Mock Interview Lab v1.0

The **AI Voice Agent Mock Interview Lab** (`/interview/voice`) is an enterprise-grade, 1-on-1 real-time spoken technical, behavioral, and system design interview platform inside Career Agents.

---

## 🏛️ Architecture Overview

```
User Browser (Web Speech API)
   │
   ├── SpeechSynthesis (Voice Output / TTS)
   ├── SpeechRecognition (Voice Input / STT)
   └── Text Fallback Mode
         │
         ▼
Next.js API Route (/api/interview/voice)
   │
   ├── Zod Payload Validation
   ├── Server-Side Secret & Key Resolution (resolveServerApiKey)
   ├── Security Rate Limiter (enforceRequestLimits)
   └── AI Gateway / Failover Provider Chain (Gemini, Groq, OpenAI, Claude, DeepSeek)
         │
         ▼
STAR Scorecard & Diagnostic Roadmap Generator
```

---

## 🎯 Features & Capabilities

1. **146 Agent Persona Marketplace**: Select from 146 specialized AI agents across 19 career divisions.
2. **13 Interview Modes**:
   - Behavioral (STAR Framework)
   - Technical General
   - Data Structures & Algorithms (DSA)
   - System Design & Distributed Architecture
   - Frontend Engineering
   - Backend Engineering
   - Full Stack Engineering
   - AI / Machine Learning
   - DevOps & Cloud Infrastructure
   - Database Engineering
   - Cloud Architecture
   - HR & Culture Screen
   - Managerial & Leadership
3. **27 BCP-47 Languages**: Support for `en-US`, `en-GB`, `de-DE`, `fr-FR`, `es-ES`, `pt-BR`, `hi-IN`, `kn-IN`, `ta-IN`, `te-IN`, `ja-JP`, `ko-KR`, `zh-CN`, `nl-NL`, `ar-SA`, `tr-TR`, `pl-PL`, `sv-SE`, `no-NO`, `da-DK`, `fi-FI`, `id-ID`, `vi-VN`, `th-TH`, `uk-UA`.
4. **Finite State Machine (FSM)**:
   - `IDLE` → `CONFIGURING` → `STARTING` → `INTERVIEWER_SPEAKING` → `LISTENING` → `PROCESSING` → `WAITING_FOR_NEXT_QUESTION` → `PAUSED` → `COMPLETED` → `ERROR`.
5. **Fail-Safe Fallbacks**:
   - Automatic Text Mode fallback when microphone access is blocked or unsupported.
   - Dynamic simulation fallback question and STAR scorecard generators when LLM API keys are unconfigured.

---

## 🔒 Security & Privacy

- **Server-Side Key Resolution**: API keys and provider secrets are resolved exclusively on the server (`resolveServerApiKey`). Zero secrets are exposed to client bundles.
- **Input Sanitization**: Candidate responses are treated as untrusted input and isolated from system instructions to prevent prompt injection.
- **Telemetry Isolation**: Telemetry and database operations are fail-safe; database unavailability never crashes active interview sessions.

---

## 🧪 Testing & Validation

Run repository validation scripts:

```bash
python scripts/generate-data.py
python scripts/validate.py
npm run type-check
```
