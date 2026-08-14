const tracks = [
  'Jaikal Mahakal - From _Goodbye__spotdown.org.mp3',
  'Karpur Gauram Karunavtaram_spotdown.org.mp3',
  'Lingaashtakam_spotdown.org.mp3',
  'Mera Bhola Hai Bhandari_spotdown.org.mp3',
  'Namami Shamishan_spotdown.org.mp3',
  'Om Namah Shivay_spotdown.org.mp3',
  'Rudrashtakam_spotdown.org.mp3',
  'Shankar Teri Jata Me (Bhajan) [Live]_spotdown.org.mp3',
  'Shiv Kailash (Live in Mumbai)_spotdown.org.mp3',
  'Shiv Kailasho Ke Vasi_spotdown.org.mp3',
  'Shiv Tandav Stotram_spotdown.org (1).mp3',
  'Shiv Tandav Stotram_spotdown.org.mp3',
  'Shivji Ki Sawari Aayi Bhole Ki sawari_spotdown.org.mp3',
  'Shree Rudraashtakam_spotdown.org.mp3',
  'Shree Shiv Panchakshram Stotram_spotdown.org.mp3',
  'नागेन्द्रहाराय त्रिलोचनाय_spotdown.org.mp3'
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

function cleanTitle(fileName) {
  return fileName.replace(/_spotdown\.org( \(1\))?\.mp3$/i, '').trim();
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const wholeSeconds = Math.floor(seconds);
  return `${Math.floor(wholeSeconds / 60)}:${String(wholeSeconds % 60).padStart(2, '0')}`;
}

function renderQueue() {
  queue.innerHTML = tracks.map((fileName, index) => `<button data-track="${index}" class="${index === currentTrack ? 'active' : ''}"><span>${String(index + 1).padStart(2, '0')}</span><p>${cleanTitle(fileName)}<small>Local audio</small></p><time>${index === currentTrack ? 'Playing' : 'Play'}</time></button>`).join('');
}

function loadTrack(index, shouldPlay = false) {
  currentTrack = (index + tracks.length) % tracks.length;
  audio.src = `songs/${encodeURIComponent(tracks[currentTrack])}`;
  trackName.textContent = cleanTitle(tracks[currentTrack]);
  artistName.textContent = `Track ${currentTrack + 1} of ${tracks.length} · Local collection`;
  byId('elapsed').textContent = '0:00';
  byId('duration').textContent = '0:00';
  progressFill.style.width = '0%';
  renderQueue();
  queue.querySelector('.active')?.scrollIntoView({ block: 'nearest' });
  if (shouldPlay) audio.play().catch(() => {});
}

function togglePlayback() {
  if (audio.paused) audio.play();
  else audio.pause();
}

playButton.addEventListener('click', togglePlayback);
byId('nextTrack').addEventListener('click', () => loadTrack(currentTrack + 1, true));
byId('previousTrack').addEventListener('click', () => loadTrack(currentTrack - 1, true));
byId('volume').addEventListener('input', (event) => { audio.volume = Number(event.target.value) / 100; });
queue.addEventListener('click', (event) => {
  const item = event.target.closest('[data-track]');
  if (item) loadTrack(Number(item.dataset.track), true);
});
document.querySelector('.progress-track').addEventListener('click', (event) => {
  if (!audio.duration) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  audio.currentTime = ((event.clientX - bounds.left) / bounds.width) * audio.duration;
});

audio.addEventListener('loadedmetadata', () => { byId('duration').textContent = formatTime(audio.duration); });
audio.addEventListener('timeupdate', () => {
  byId('elapsed').textContent = formatTime(audio.currentTime);
  progressFill.style.width = `${audio.duration ? (audio.currentTime / audio.duration) * 100 : 0}%`;
});
audio.addEventListener('play', () => {
  playButton.textContent = 'Ⅱ';
  playButton.setAttribute('aria-label', 'Pause');
  body.classList.add('is-playing');
  renderQueue();
});
audio.addEventListener('pause', () => {
  playButton.textContent = '▶';
  playButton.setAttribute('aria-label', 'Play');
  body.classList.remove('is-playing');
});
audio.addEventListener('ended', () => loadTrack(currentTrack + 1, true));
audio.addEventListener('error', () => {});

audio.volume = 0.7;
loadTrack(currentTrack);
