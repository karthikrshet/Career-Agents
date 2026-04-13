# Career OS — Theming & Design System

This document explains the theme system, Tailwind CSS configurations, global variables, and dark/light components styling in Career OS.

---

## Tailwind Design Tokens

The styling architecture is declared in `apps/web/tailwind.config.js`. It defines custom design tokens using CSS variables:

```javascript
// apps/web/tailwind.config.js
module.exports = {
  darkMode: ["class"],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

---

## Global CSS Variables (`globals.css`)

CSS values are configured in `apps/web/src/app/globals.css`. By default, Career OS employs a dark theme with a glassmorphism aesthetic:

```css
/* apps/web/src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 224 71% 4%;
    --foreground: 213 31% 91%;

    --muted: 223 47% 11%;
    --muted-foreground: 215.4 16.3% 56.9%;

    --popover: 224 71% 4%;
    --popover-foreground: 213 31% 91%;

    --card: 224 71% 4%;
    --card-foreground: 213 31% 91%;

    --border: 216 34% 17%;
    --input: 216 34% 17%;

    --primary: 263.4 70% 50.4%;
    --primary-foreground: 210 40% 98%;

    --secondary: 222.2 47.4% 11.2%;
    --secondary-foreground: 210 40% 98%;

    --accent: 216 34% 17%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 63% 31%;
    --destructive-foreground: 210 40% 98%;

    --ring: 263.4 70% 50.4%;

    --radius: 0.75rem;
  }
}
```

---

## Dark / Light Transitions

To support a togglable dark/light display:
- **Class-based selection:** Tailwind uses the `.dark` class attached to the root `<html>` element.
- **Theme Provider:** Toggled through Zustand state (`settings.theme`). When updated, the theme provider removes or adds the class `.dark` to the document root:
  ```typescript
  // Component implementation example
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  ```

---

## Layout Aesthetics

- **Glassmorphism:** Navigation menus and cards leverage transparency with blur details (`backdrop-blur-md bg-card/60 border-border/80`).
- **Gradient Backgrounds:** Backgrounds mix solid colors with subtle dark mesh gradients to create depth without distracting from text.
