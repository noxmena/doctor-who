import fs from 'fs';

async function fetchEpisodes() {
  const res = await fetch('https://api.tvmaze.com/shows/210/episodes');
  const episodes = await res.json();
  
  const existingPath = './src/data/episodes.ts';
  console.log('Got ' + episodes.length + ' episodes');
  
  const formatted = episodes.map(ep => ({
    id: `s${ep.season}e${ep.number}`,
    season: ep.season,
    episodeNumber: ep.number,
    title: ep.name,
    description: ep.summary ? ep.summary.replace(/<[^>]*>?/gm, '') : 'No description',
    thumbnailUrl: ep.image?.original || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000',
    duration: ep.runtime + 'm'
  }));

  fs.writeFileSync('./fetched.json', JSON.stringify(formatted, null, 2));
}

fetchEpisodes();
