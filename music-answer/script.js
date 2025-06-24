AOS.init();

const toggle = document.getElementById("darkModeToggle");
toggle.onclick = () => {
  document.body.classList.toggle("dark");
  toggle.innerHTML = document.body.classList.contains("dark")
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
};

const clientId = 'f64b1063d9114a729d9a136a7f9a6aeb';
const clientSecret = '1e8bf4e117ee40c8af249e81772cd24b';

async function getToken() {
  const result = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    },
    body: 'grant_type=client_credentials'
  });
  const data = await result.json();
  return data.access_token;
}

async function search() {
  const query = document.getElementById('searchInput').value;
  const resultsDiv = document.getElementById('results');

  resultsDiv.innerHTML = '<p style="text-align:center; color:#ccc;">🔄 Loading...</p>';

  if (!query) {
    resultsDiv.innerHTML = '<p style="text-align:center; color:salmon;">❌ Masukkan kata kunci pencarian dulu ya!</p>';
    return;
  }

  const token = await getToken();
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=12`,
    { headers: { 'Authorization': 'Bearer ' + token } }
  );
  const data = await response.json();
  resultsDiv.innerHTML = '';

  if (!data.tracks.items.length) {
    resultsDiv.innerHTML = '<p style="text-align:center; color:lightpink;">😢 Lagu tidak ditemukan.</p>';
    return;
  }

  data.tracks.items.forEach(track => {
    const preview = track.preview_url
      ? `<audio controls src="${track.preview_url}"></audio>`
      : `<p style="font-size: 14px; color: #bbb;">🎧 No preview available</p>`;

    const card = document.createElement('div');
    card.className = 'track-card';
    card.setAttribute('data-aos', 'fade-up');
    card.onclick = () => window.open(track.external_urls.spotify, '_blank');
    card.innerHTML = `
      <img src="${track.album.images[0].url}" alt="Album Cover" />
      <p><strong>${track.name}</strong></p>
      <p>${track.artists[0].name}</p>
      ${preview}
    `;
    resultsDiv.appendChild(card);
  });
}

new Typed('#typed', {
  strings: ['🎵 nsyTuneSpace 🦋', 'Temukan musik favoritmu 🎶', '✨ Explore. Discover. Listen. ✨'],
  typeSpeed: 70,
  backSpeed: 40,
  loop: true
});
