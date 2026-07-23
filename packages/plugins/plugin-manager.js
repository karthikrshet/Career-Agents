import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

const PLUGINS_DIR = path.join(root, 'plugins');

export async function loadPlugins() {
  const commandsList = {};
  const loadedPlugins = [];

  if (!fs.existsSync(PLUGINS_DIR)) {
    fs.mkdirSync(PLUGINS_DIR, { recursive: true });
    return { commandsList, loadedPlugins };
  }

  const files = fs.readdirSync(PLUGINS_DIR).filter(f => f.endsWith('.js'));
  
  for (const file of files) {
    const filePath = path.join(PLUGINS_DIR, file);
    try {
      const moduleUrl = `file:///${filePath.replace(/\\/g, '/')}`;
      const pluginModule = await import(moduleUrl);
      
      const hasMetadata = typeof pluginModule.metadata === 'function';
      const hasCommands = typeof pluginModule.commands === 'function';
      const hasRegister = typeof pluginModule.register === 'function';

      if (hasMetadata && hasCommands) {
        const metadata = pluginModule.metadata();
        const commands = pluginModule.commands();

        if (hasRegister) {
          pluginModule.register({ root });
        }

        Object.entries(commands).forEach(([cmdName, handler]) => {
          commandsList[cmdName] = {
            handler,
            pluginName: metadata.name
          };
        });

        loadedPlugins.push({
          name: metadata.name,
          version: metadata.version,
          description: metadata.description
        });
      }
    } catch (err) {
      console.error(`[Plugin Manager] Failed to load plugin ${file}: ${err.message}`);
    }
  }

  return { commandsList, loadedPlugins };
}
