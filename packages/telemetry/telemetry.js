import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

const TELEMETRY_LOG = path.join(root, 'exports', 'logs', 'telemetry.log');

export function trackEvent(commandName, metadata = {}) {
  let profile = { telemetry_opt_in: false };
  
  try {
    const profilePath = path.join(root, '.career-profile.json');
    if (fs.existsSync(profilePath)) {
      profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
    }
  } catch (e) {}
  
  if (!profile.telemetry_opt_in) {
    return false;
  }

  const timestamp = new Date().toISOString();
  const event = {
    timestamp,
    command: commandName,
    cli_version: '1.4.0',
    platform: process.platform,
    arch: process.arch,
    ...metadata
  };

  try {
    fs.mkdirSync(path.dirname(TELEMETRY_LOG), { recursive: true });
    fs.appendFileSync(TELEMETRY_LOG, JSON.stringify(event) + '\n', 'utf8');
    return true;
  } catch (err) {
    return false;
  }
}
