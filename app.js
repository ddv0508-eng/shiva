const tracks = [
  {
    title: 'Jaikal Mahakal',
    url: 'https://files.catbox.moe/vgyux4.mp3'
  },
  {
    title: 'Karpur Gauram Karunavtaram',
    url: 'https://files.catbox.moe/tlxuyv.mp3'
  },
  {
    title: 'Lingaashtakam',
    url: 'https://files.catbox.moe/cgn808.mp3'
  },
  {
    title: 'Mera Bhola Hai Bhandari',
    url: 'https://files.catbox.moe/x01wul.mp3'
  },
  {
    title: 'Namami Shamishan',
    url: 'https://files.catbox.moe/3ltxq1.mp3'
  },
  {
    title: 'Om Namah Shivay',
    url: 'https://files.catbox.moe/8q7tst.mp3'
  },
  {
    title: 'Rudrashtakam',
    url: 'https://files.catbox.moe/lkkrry.mp3'
  },
  {
    title: 'Shankar Teri Jata Me (Bhajan) [Live]',
    url: 'https://files.catbox.moe/oh8tto.mp3'
  },
  {
    title: 'Shiv Kailash (Live in Mumbai)',
    url: 'https://files.catbox.moe/nposd9.mp3'
  },
  {
    title: 'Shiv Kailasho Ke Vasi',
    url: 'https://files.catbox.moe/1uf6cm.mp3'
  },
  {
    title: 'Shiv Tandav Stotram',
    url: 'https://files.catbox.moe/yu9snz.mp3'
  },
  {
    title: 'Shiv Tandav Stotram',
    url: 'https://files.catbox.moe/bf1cjc.mp3'
  },
  {
    title: 'Shivji Ki Sawari Aayi Bhole Ki Sawari',
    url: 'https://files.catbox.moe/nypupo.mp3'
  },
  {
    title: 'Shree Rudraashtakam',
    url: 'https://files.catbox.moe/6ktyzg.mp3'
  },
  {
    title: 'Shree Shiv Panchakshram Stotram',
    url: 'https://files.catbox.moe/t64m46.mp3'
  },
  {
    title: 'नागेन्द्रहाराय त्रिलोचनाय',
    url: 'https://files.catbox.moe/o20ukp.mp3'
  }
];

const audio = document.querySelector('#audioPlayer');
const body = document.body;
const byId = (id) => document.getElementById(id);

const playButton = byId('togglePlay');
const trackName = byId('trackName');
const artistName = byId('artistName');
const progressFill = byId('progressFill');
const queue = byId('trackQueue');

let currentTrack = 9;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';

  const wholeSeconds = Math.floor(seconds);

  return `${Math.floor(wholeSeconds / 60)}:${String(
    wholeSeconds % 60
  ).padStart(2, '0')}`;
}

function renderQueue() {
  queue.innerHTML = tracks
    .map(
      (track, index) => `
        <button
          data-track="${index}"
          class="${index === currentTrack ? 'active' : ''}"
        >
          <span>${String(index + 1).padStart(2, '0')}</span>
          <p>
            ${track.title}
            <small>Online audio</small>
          </p>
          <time>${index === currentTrack ? 'Playing' : 'Play'}</time>
        </button>
      `
    )
    .join('');
}

function loadTrack(index, shouldPlay = false) {
  currentTrack = (index + tracks.length) % tracks.length;

  const track = tracks[currentTrack];

  // Load the remote Catbox MP3 directly
  audio.src = track.url;

  trackName.textContent = track.title;
  artistName.textContent = `Track ${currentTrack + 1} of ${tracks.length} · Online collection`;

  byId('elapsed').textContent = '0:00';
  byId('duration').textContent = '0:00';

  progressFill.style.width = '0%';

  renderQueue();

  queue
    .querySelector('.active')
    ?.scrollIntoView({
      block: 'nearest'
    });

  if (shouldPlay) {
    audio.play().catch(() => {});
  }
}

function togglePlayback() {
  if (audio.paused) {
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}


// Play / pause
playButton.addEventListener('click', togglePlayback);


// Next track
byId('nextTrack').addEventListener('click', () => {
  loadTrack(currentTrack + 1, true);
});


// Previous track
byId('previousTrack').addEventListener('click', () => {
  loadTrack(currentTrack - 1, true);
});


// Volume
byId('volume').addEventListener('input', (event) => {
  audio.volume = Number(event.target.value) / 100;
});


// Queue track selection
queue.addEventListener('click', (event) => {
  const item = event.target.closest('[data-track]');

  if (item) {
    loadTrack(Number(item.dataset.track), true);
  }
});


// Progress bar seeking
document
  .querySelector('.progress-track')
  .addEventListener('click', (event) => {
    if (!audio.duration) return;

    const bounds = event.currentTarget.getBoundingClientRect();

    audio.currentTime =
      ((event.clientX - bounds.left) / bounds.width) *
      audio.duration;
  });


// Audio metadata loaded
audio.addEventListener('loadedmetadata', () => {
  byId('duration').textContent = formatTime(audio.duration);
});


// Audio progress
audio.addEventListener('timeupdate', () => {
  byId('elapsed').textContent = formatTime(audio.currentTime);

  progressFill.style.width = `${
    audio.duration
      ? (audio.currentTime / audio.duration) * 100
      : 0
  }%`;
});


// Playing state
audio.addEventListener('play', () => {
  playButton.textContent = 'Ⅱ';
  playButton.setAttribute('aria-label', 'Pause');

  body.classList.add('is-playing');

  renderQueue();
});


// Paused state
audio.addEventListener('pause', () => {
  playButton.textContent = '▶';
  playButton.setAttribute('aria-label', 'Play');

  body.classList.remove('is-playing');
});


// Automatically play next track
audio.addEventListener('ended', () => {
  loadTrack(currentTrack + 1, true);
});


// Audio loading error
audio.addEventListener('error', () => {
  console.error(
    'Unable to load audio:',
    tracks[currentTrack]?.url
  );
});


// Default volume
audio.volume = 0.7;


// Load the initial track
loadTrack(currentTrack);
