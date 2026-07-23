import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

const PROFILE_FILE = path.join(root, '.career-profile.json');

const defaultProfile = {
  name: 'Candidate Profile',
  resume_score: 0,
  github_score: 0,
  linkedin_score: 0,
  interview_score: 0,
  overall_career_score: 0,
  goals: [
    { id: 1, task: 'Audit resume structures using Resume Studio', done: false },
    { id: 2, task: 'Verify GitHub portfolio repository Grade', done: false },
    { id: 3, task: 'Evaluate LinkedIn taglines signaling keywords', done: false },
    { id: 4, task: 'Complete mock technical loop simulation', done: false }
  ],
  telemetry_opt_in: false
};

export function loadProfile() {
  if (!fs.existsSync(PROFILE_FILE)) {
    saveProfile(defaultProfile);
    return defaultProfile;
  }
  try {
    const raw = fs.readFileSync(PROFILE_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return defaultProfile;
  }
}

export function saveProfile(profile) {
  try {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2), 'utf8');
    return true;
  } catch (err) {
    return false;
  }
}

export function updateLocalProfileScore(type, score) {
  const profile = loadProfile();
  if (type === 'resume_score') profile.resume_score = score;
  else if (type === 'github_score') profile.github_score = score;
  else if (type === 'linkedin_score') profile.linkedin_score = score;
  else if (type === 'interview_score') profile.interview_score = score;

  profile.overall_career_score = Math.round(
    ((profile.resume_score || 0) + 
     (profile.github_score || 0) + 
     (profile.linkedin_score || 0) + 
     (profile.interview_score || 0)) / 4
  );

  saveProfile(profile);
  return profile;
}
