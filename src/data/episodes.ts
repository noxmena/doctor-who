import { Episode } from '../types';

export const EPISODES: Episode[] = [
  // Documentaries (Season 0)
  {
    id: 'doc1',
    season: 0,
    episodeNumber: 1,
    title: 'Earth Conquest - The World Tour',
    description: 'A global documentary following the Doctor Who world tour.',
    driveId: '1T7R58dWk5-RhbdEa8dUl6aAc7MkzInqt',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000',
    duration: '90m'
  },
  {
    id: 'doc2',
    season: 0,
    episodeNumber: 2,
    title: 'The Ultimate Companion',
    description: 'A special look at the companions of the Doctor.',
    driveId: '1hesW_G62_OThYGP-_Pjul_x3_6E3YPY',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000',
    duration: '60m'
  },
  // Season 5
  { id: 's5e4', season: 5, episodeNumber: 4, title: 'The Time of Angels', description: 'Facing the Weeping Angels.', driveId: '1lCYw2tcVNGKXDhk21P__arBvb5aXb0Ff', thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000', duration: '45m' },
  { id: 's5e5', season: 5, episodeNumber: 5, title: 'Flesh and Stones', description: 'Angels in the forest.', driveId: '1zVvryz1gYdWSZAR1_TOmUpBaU5UPpqOE', thumbnailUrl: 'https://images.unsplash.com/photo-1518005020252-3b8c5210bd6e?q=80&w=1000', duration: '45m' },
  { id: 's5e7', season: 5, episodeNumber: 7, title: "Amy's Choice", description: 'Choosing between two dreams.', driveId: '1kRCm0027RaAPV2MU-JYjzcsmrmAWbcul', thumbnailUrl: 'https://images.unsplash.com/photo-1483730105746-24f60f60716c?q=80&w=1000', duration: '45m' },
  { id: 's5e8', season: 5, episodeNumber: 8, title: 'The Hungry Earth', description: 'Beneath the surface.', driveId: '1fhhlQHJ5uJLaHi4iP7IXTcEbrLrJAaI9', thumbnailUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?q=80&w=1000', duration: '45m' },
  { id: 's5e9', season: 5, episodeNumber: 9, title: 'Cold Blood', description: 'Peace in our time?', driveId: '1SGyveVK0u3G9peMM3hrAx7QuTe9sXbjt', thumbnailUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000', duration: '45m' },
  { id: 's5e10', season: 5, episodeNumber: 10, title: 'Vincent and the Doctor', description: 'Meeting Van Gogh.', driveId: '18DKivDe493_UTfDnXN08RVOd16MqTtI0', thumbnailUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=1000', duration: '45m' },
  { id: 's5e11', season: 5, episodeNumber: 11, title: 'The Lodger', description: 'The Doctor moves in.', driveId: '1tHf-r4zH29LJlSuK_gqfJroJEyKBVcie', thumbnailUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000', duration: '45m' },
  { id: 's5e12', season: 5, episodeNumber: 12, title: 'The Pandorica Opens', description: 'A trap for the Doctor.', driveId: '1PKACSdc8LwOpTpVLxzz2TrvQ931d-jxZ', thumbnailUrl: 'https://images.unsplash.com/photo-1503756234508-e32369269deb?q=80&w=1000', duration: '50m' },
  { id: 's5e13', season: 5, episodeNumber: 13, title: 'The Big Bang', description: 'Saving reality.', driveId: '1oEKwH-i28cjdHqeFetC6bBikBD1E2AZ3', thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000', duration: '55m' },

  // Season 6
  { id: 's6e1', season: 6, episodeNumber: 1, title: 'The Impossible Astronaut', description: '1969 USA.', driveId: '1vWY5zDpvCUVdGLa2mCsqGAwg08w5_eFi', thumbnailUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000', duration: '45m' },
  { id: 's6e2', season: 6, episodeNumber: 2, title: 'Day of the Moon', description: 'The Silence is everywhere.', driveId: '10ZrevdHgakZkTfevnh-WT3ZnF6COVs9P', thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000', duration: '45m' },
  { id: 's6e3', season: 6, episodeNumber: 3, title: 'The Curse of the Black Spot', description: 'A siren calls.', driveId: '1iPmUa-m2uL9AHNoFhP7GQqYvf9NH46h3', thumbnailUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=1000', duration: '45m' },
  { id: 's6e4', season: 6, episodeNumber: 4, title: "The Doctor's Wife", description: 'A house on an asteroid.', driveId: '1xjIpAL2yPfkTkTj5HuA_yXSWuOg8qH2I', thumbnailUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000', duration: '45m' },
  { id: 's6e5', season: 6, episodeNumber: 5, title: 'The Rebel Flesh', description: 'Double trouble.', driveId: '1MvAb7QVw5HuY1QVJsDfNTsdeDc9olIxJ', thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000', duration: '45m' },

  // Season 7
  { id: 's7e1', season: 7, episodeNumber: 1, title: 'Asylum of the Daleks', description: 'Dalek prison.', driveId: '1CN8gWYac-i3CLA61MeperdvMQlH66gUK', thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000', duration: '50m' },
  { id: 's7e2', season: 7, episodeNumber: 2, title: 'Dinosaurs on a Spaceship', description: 'Prehistoric cargo.', driveId: '1lM6AjSEaJb_NhBLuAEZFWNgsw9hC0xbc', thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000', duration: '45m' },
  { id: 's7e3', season: 7, episodeNumber: 3, title: 'A Town Called Mercy', description: 'Gunslinger.', driveId: '1pjwds5yYY99F5GOf4P8TdWt2vMQhzE0I', thumbnailUrl: 'https://images.unsplash.com/photo-1518005020252-3b8c5210bd6e?q=80&w=1000', duration: '45m' },
  { id: 's7e4', season: 7, episodeNumber: 4, title: 'The Power of Three', description: 'Black cubes.', driveId: '181jlBQHUYz5aEKYgYhi3YYGG8YVyj8kM', thumbnailUrl: 'https://images.unsplash.com/photo-1483730105746-24f60f60716c?q=80&w=1000', duration: '45m' },
  { id: 's7e6', season: 7, episodeNumber: 6, title: 'The Bells of Saint John', description: 'WiFi souls.', driveId: '1TlKFtUGKJt8B4iGT6smJYf9ubCdCdieH', thumbnailUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?q=80&w=1000', duration: '45m' },
  { id: 's7e7', season: 7, episodeNumber: 7, title: 'The Rings of Akhaten', description: 'An old song.', driveId: '1cEiKGE532yonFgB4TStZZal1qQLja3YJ', thumbnailUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000', duration: '45m' },
  { id: 's7e8', season: 7, episodeNumber: 8, title: 'Cold War', description: 'Submarine Silurian.', driveId: '14eIttK_ODd0o14Uw_i7xgwYMnymUApfA', thumbnailUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=1000', duration: '45m' },
  { id: 's7e9', season: 7, episodeNumber: 9, title: 'Hide', description: 'Ghost hunt.', driveId: '1eHpuZy1nxR4L4Ux514embwuTokpX3U4R', thumbnailUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000', duration: '45m' },
  { id: 's7e10', season: 7, episodeNumber: 10, title: 'Journey to the Centre of the TARDIS', description: 'Inside the machine.', driveId: '1JYynOsglcPD-oHWtJ869psMNf1hyYZv1', thumbnailUrl: 'https://images.unsplash.com/photo-1503756234508-e32369269deb?q=80&w=1000', duration: '45m' },
  { id: 's7e11', season: 7, episodeNumber: 11, title: 'The Crimson Horror', description: 'Sweeterton.', driveId: '1Bk3BzEEpDJc4DQxVmGYQqY3kDWctfeu4', thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000', duration: '45m' },
  { id: 's7e12', season: 7, episodeNumber: 12, title: 'Nightmare in Silver', description: 'Cybermen upgrades.', driveId: '1Kj6gZgc4qtEVVK4kARvVWCpHX7NxvS_8', thumbnailUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000', duration: '45m' },
  { id: 's7e13', season: 7, episodeNumber: 13, title: 'The Name of the Doctor', description: 'Trenzalore.', driveId: '1h2mas8-vjsPVevsce58C9o4_DsiI4MGR', thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000', duration: '50m' },

  // Season 8
  { id: 's8e1', season: 8, episodeNumber: 1, title: 'Deep Breath', description: 'New Doctor, new mystery.', driveId: '1tRRwUO7F4wQrpX7m2jnQ8sVq8eQNcMk', thumbnailUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=1000', duration: '75m' },
  { id: 's8e2', season: 8, episodeNumber: 2, title: 'Into the Dalek', description: 'Inner journey.', driveId: '1kifuPcSknIdlVap2WMkgx1t2JcoRGblA', thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000', duration: '45m' },
  { id: 's8e3', season: 8, episodeNumber: 3, title: 'Robot of Sherwood', description: 'Robin Hood.', driveId: '1-EXd9vMO3Ej8oXLks1c8cpQ28axmCDBA', thumbnailUrl: 'https://images.unsplash.com/photo-1518005020252-3b8c5210bd6e?q=80&w=1000', duration: '45m' },
  { id: 's8e4', season: 8, episodeNumber: 4, title: 'Listen', description: 'Fear of the dark.', driveId: '1-Jbbce28RMEGhCL0OWaiLJWc-rOjOfkZ', thumbnailUrl: 'https://images.unsplash.com/photo-1483730105746-24f60f60716c?q=80&w=1000', duration: '45m' },
  { id: 's8e5', season: 8, episodeNumber: 5, title: 'Time Heist', description: 'Bank job.', driveId: '1-JbrhLih_cTWzpPwFw9zCLHIxr6qQOXg', thumbnailUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?q=80&w=1000', duration: '45m' },
  { id: 's8e6', season: 8, episodeNumber: 6, title: 'The Caretaker', description: 'Cover job.', driveId: '1-Ok1fMAxv5YvWT0Bq_8HSXZs00d_bcda', thumbnailUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000', duration: '45m' },
  { id: 's8e7', season: 8, episodeNumber: 7, title: 'Kill the Moon', description: 'Decision time.', driveId: '1-QUA8YGvD6YG5ESBai_oAnD4esSqvr1R', thumbnailUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=1000', duration: '45m' },
  { id: 's8e9', season: 8, episodeNumber: 9, title: 'Flatline', description: '2D monsters.', driveId: '1IqHV8rdqcU3L4xBV4KmZ_hgbYlr89cA', thumbnailUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000', duration: '45m' },
  { id: 's8e10', season: 8, episodeNumber: 10, title: 'In the Forest of the Night', description: 'Nature takes back.', driveId: '1bwQviZKSEXHhvMVAb9hw-5dziyrNlGE', thumbnailUrl: 'https://images.unsplash.com/photo-1503756234508-e32369269deb?q=80&w=1000', duration: '45m' },
  { id: 's8e11', season: 8, episodeNumber: 11, title: 'Dark Water', description: 'Afterlife.', driveId: '1LnuJXgnlQmIi_-LHTnNAlslF9IF-T8k', thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000', duration: '45m' },
  { id: 's8e12', season: 8, episodeNumber: 12, title: 'Death in Heaven', description: 'Cyber-army.', driveId: '1qtO2kG1VRXg1vetFXcofSAPBhROgVQI', thumbnailUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000', duration: '60m' },

  // Season 9
  { id: 's9e1', season: 9, episodeNumber: 1, title: "The Magician's Apprentice", description: 'A request from an old enemy.', driveId: '1hbyL9wARapckg5Eji8GGtbbpzdYOZ_0', thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000', duration: '45m' },
  { id: 's9e2', season: 9, episodeNumber: 2, title: "The Witch's Familiar", description: 'Trapped on Skaro.', driveId: '15O5atg-ArFznJi9amvCUkgnI2WBvgOQ', thumbnailUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=1000', duration: '45m' },
  { id: 's9e3', season: 9, episodeNumber: 3, title: 'Under the Lake', description: 'Ghostly base.', driveId: '11neSrU6Kp_Do-PQOTKhh4ASt8gewqiU', thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000', duration: '45m' },
  { id: 's9e4', season: 9, episodeNumber: 4, title: 'Before the Flood', description: 'Time paradox.', driveId: '1mph54YYmBudbvY6LHAFp9Jyk7CiNF0U', thumbnailUrl: 'https://images.unsplash.com/photo-1518005020252-3b8c5210bd6e?q=80&w=1000', duration: '45m' },
  { id: 's9e5', season: 9, episodeNumber: 5, title: 'The Girl Who Died', description: 'Vikings and warriors.', driveId: '1z78-jnpYJsFhcAyRZhlbUed11sJKXn8', thumbnailUrl: 'https://images.unsplash.com/photo-1483730105746-24f60f60716c?q=80&w=1000', duration: '45m' },
  { id: 's9e6', season: 9, episodeNumber: 6, title: 'The Woman Who Lived', description: 'Immortal life.', driveId: '1qPhVcdiayipHqmE6Lf3d_jycsop0-H8', thumbnailUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?q=80&w=1000', duration: '45m' },
  { id: 's9e7', season: 9, episodeNumber: 7, title: 'The Zygon Invasion', description: 'Alien infiltration.', driveId: '1pwNS4V8e1fqqyCsuMx8Wx8u5IheqasU', thumbnailUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000', duration: '45m' },
  { id: 's9e8', season: 9, episodeNumber: 8, title: 'The Zygon Inversion', description: 'The Osgood Box.', driveId: '123tlYHhmJgiQCfP6gLQY8LVZk1BXt_c', thumbnailUrl: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?q=80&w=1000', duration: '45m' },
  { id: 's9e9', season: 9, episodeNumber: 9, title: 'Sleep No More', description: 'Found footage.', driveId: '18g-XMC7ipkO_Kve5PZubYQzBMq43nP0', thumbnailUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000', duration: '45m' },
  { id: 's9e10', season: 9, episodeNumber: 10, title: 'Face the Raven', description: 'Trap street.', driveId: '1OeIpNHPT5Brk71qqn1CNdeBgP2Eh5WE', thumbnailUrl: 'https://images.unsplash.com/photo-1503756234508-e32369269deb?q=80&w=1000', duration: '45m' },
  { id: 's9e11', season: 9, episodeNumber: 11, title: 'Heaven Sent', description: 'The Long Way round.', driveId: '138yJN_P6EQ2PebbGF734WtsTJ9VHXwk', thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000', duration: '55m' },
  { id: 's9e12', season: 9, episodeNumber: 12, title: 'Hell Bent', description: 'Gallifrey.', driveId: '1B2K2MMwTTuSeT7eoovvMkveEpc9mPf8', thumbnailUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=1000', duration: '60m' },

  // Season 10 Special
  {
    id: 's10s1',
    season: 10,
    episodeNumber: 0,
    title: 'The Return of Doctor Mysterio',
    description: 'The Doctor joins forces with a superhero.',
    driveId: '1fmvoTSdfrZwENyMYKsmeS0E1lClqgik',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000',
    duration: '60m'
  }
];
