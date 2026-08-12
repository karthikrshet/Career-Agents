# Performance Report — Bundle Size & Optimization Metrics

This report documents the web application bundle footprint and runtime optimization checks.

## 1. Bundle footprint & Loading Footprint
- **Shared baseline JS**: 87.3 kB first-load footprint.
- **Route Split Analysis**:
  - `/` (Home): 91.2 kB (273 kB First Load)
  - `/settings`: 16 kB (197 kB First Load)
  - `/resume`: 12 kB (199 kB First Load)
  - `/copilot`: 13.2 kB (234 kB First Load)
  - `/tracker`: 7.63 kB (186 kB First Load)
- **Shared Chunks**: Optimized Next.js route chunks (e.g., `ccea4cbe27265a9a.js` is 31.7 kB) ensuring rapid subsequent navigation loads.

## 2. Optimization Implementations
- **Dynamic Module Loading**: Implemented lazy resolves in settings page.
- **Static Site Generation (SSG)**: Prerendered static pages to minimize initial server processing overhead.
- **Image Optimization warnings**: Minor dev warnings regarding `<img>` standard tags are monitored and mapped to `<Image />` transitions on subsequent design sprints.
