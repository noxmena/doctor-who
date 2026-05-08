import fs from 'fs';

const existingTs = fs.readFileSync('./src/data/episodes.ts', 'utf-8');
const fetched = JSON.parse(fs.readFileSync('./fetched.json', 'utf-8'));

// Extract existing episodes from TS file using regex
let existingEpisodes = [];
try {
  // Dirty parsing
  const match = existingTs.match(/export const EPISODES: Episode\[\] = \[([\s\S]*?)\];/);
  if (match) {
    const arrString = '[' + match[1] + ']';
    existingEpisodes = eval(arrString);
  }
} catch (e) {
  console.log("Fallback eval...", e);
  // Just manual matching
  const regex = /\{[\s\S]*?id:\s*'([^']+)'[\s\S]*?driveId:\s*'([^']+)'/g;
  let match;
  while ((match = regex.exec(existingTs)) !== null) {
    existingEpisodes.push({ id: match[1], driveId: match[2] });
  }
}

// Ensure unique episodes, fallback to some defaults.
const mappedEpisodes = fetched.map(ep => {
  const existing = existingEpisodes.find(e => e.id === ep.id);
  // Remove quotes in titles/descriptions just to be safe
  const title = ep.title.replace(/'/g, "\\'").replace(/"/g, '\\"');
  const desc = ep.description ? ep.description.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '') : '';
  
  return `{ id: '${ep.id}', season: ${ep.season}, episodeNumber: ${ep.episodeNumber}, title: '${title}', description: '${desc}', thumbnailUrl: '${ep.thumbnailUrl}', duration: '${ep.duration}', driveId: '${existing ? existing.driveId : ''}' }`;
});

const newTs = `import { Episode } from '../types';

export const EPISODES: Episode[] = [
  ${mappedEpisodes.join(',\n  ')}
];
`;

fs.writeFileSync('./src/data/episodes.ts', newTs);
console.log('Merged successfully.');
