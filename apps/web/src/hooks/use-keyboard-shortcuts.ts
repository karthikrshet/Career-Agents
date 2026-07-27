// apps/web/src/hooks/use-keyboard-shortcuts.ts
import { useEffect } from "react";

export interface ShortcutMap {
  [key: string]: (e: KeyboardEvent) => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCmdOrCtrl = event.metaKey || event.ctrlKey;
      let keyCombo = "";

      if (isCmdOrCtrl) keyCombo += "mod+";
      if (event.shiftKey) keyCombo += "shift+";
      if (event.altKey) keyCombo += "alt+";
      
      keyCombo += event.key.toLowerCase();

      // Check standard keys without mod if no modifier keys are pressed
      const matchedAction = shortcuts[keyCombo] || shortcuts[event.key.toLowerCase()] || shortcuts[event.key];
      if (matchedAction) {
        matchedAction(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcuts]);
}
