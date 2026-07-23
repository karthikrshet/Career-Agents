/**
 * Career OS Sample Developer Plugin
 */

export function metadata() {
  return {
    name: 'Sample Developer Plugin',
    version: '1.0.0',
    description: 'An example plugin demonstrating terminal command extensions in the Career Operating System.'
  };
}

let pluginContext = null;

export function register(api) {
  // Can store references to config files or target dirs
  pluginContext = api;
}

export function commands() {
  return {
    'sample-hello': (args) => {
      const name = args[0] || 'User';
      console.log(`\n\x1b[32m[Plugin command execution success!]\x1b[0m`);
      console.log(`Hello, ${name}! This output comes dynamically from a registered external plugin.\n`);
    }
  };
}
