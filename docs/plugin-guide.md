# Career OS Plugin Guide

Career OS includes a modular plugin architecture that allows external developers to extend CLI commands dynamically.

## Anatomy of a Plugin

All plugins must be placed as `.js` files inside the root `plugins/` directory.

A valid plugin must implement and export the following interface:

```javascript
/**
 * Return plugin metadata
 */
export function metadata() {
  return {
    name: 'My Custom Plugin',
    version: '1.0.0',
    description: 'Extends Career OS with developer tools.'
  };
}

/**
 * Perform initial configurations
 */
export function register(api) {
  // api contains root directory parameters
  this.context = api;
}

/**
 * Return command mappings
 */
export function commands() {
  return {
    'custom-command': (args) => {
      console.log('Executing my custom command with args:', args);
    }
  };
}
```

## Running Plugin Commands

Once loaded, plugin commands can be executed directly from the global CLI:

```bash
career-agents custom-command arg1 arg2
```
