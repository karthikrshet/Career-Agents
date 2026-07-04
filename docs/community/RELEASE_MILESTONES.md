# Career OS Release Milestones

This document details the versioning roadmap, release milestones, and architecture progression targets for **Career-Agents**, the Open-Source Career Operating System.

---

## 🚀 Release Roadmap

### 1. Version 1.0.0: Career OS Core (Current)
- **Goal**: Transition from a prompt repo to a structured system.
- **Deliverables**:
  - Centralized configurations (`career-os.json`, `agent-registry.json`).
  - Pre-packaged bundles (`bundles/`).
  - Search indexes and textual knowledge graphs (`search-index.json`).

### 2. Version 1.5.0: Intelligence Layer (Current)
- **Goal**: Map candidate domains, corporate alignment, and expertise guidelines.
- **Deliverables**:
  - Career Paths engine (`career-paths/`).
  - Target Company prep tracks (`companies/`).
  - Category-specific intelligence files (`intelligence/`).

### 3. Version 2.0.0: Agent Launcher (Current)
- **Goal**: Smooth integration between local setups and browser portals.
- **Deliverables**:
  - Browser-open URL launcher hooks (`launcher/launcher-registry.json`).
  - Automatic prompt copy-to-clipboard CLI actions (`career-agents launcher`).
  - IDE rules configuration injection (`career-agents use`).

### 4. Version 2.5.0: Career Marketplace (Planned)
- **Goal**: Discoverable rating database for community-developed agents.
- **Deliverables**:
  - Community PR validation hooks (`validate.py`).
  - Web client UI for searching, rating, and loading third-party career agents.

### 5. Version 3.0.0: Career Network (Planned)
- **Goal**: Decentralized, community-driven matching loops.
- **Deliverables**:
  - Peer-to-peer mock panels matching calendars.
  - Alumni mentoring outreach scheduling helpers.
