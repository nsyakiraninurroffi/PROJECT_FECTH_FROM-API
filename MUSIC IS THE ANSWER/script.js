const clientId = 'f64b1063d9114a729d9a136a7f9a6aeb';
const clientSecret = '1e8bf4e117ee40c8af249e81772cd24b';

// Ambil token dari Spotify
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

// Fungsi pencarian lagu
async function search() {
  const query = document.getElementById('searchInput').value;
  const resultsDiv = document.getElementById('results');

  resultsDiv.innerHTML = '<p style="color:#ccc;">🔄 Loading...</p>';

  if (!query) {
    resultsDiv.innerHTML = '<p style="color:salmon;">❌ Masukkan kata kunci pencarian dulu ya!</p>';
    return;
  }

  const token = await getToken();

  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=8`,
    {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    }
  );

  const data = await response.json();
  resultsDiv.innerHTML = '';

  if (!data.tracks.items.length) {
    resultsDiv.innerHTML = '<p style="color:lightpink;">😢 Lagu tidak ditemukan.</p>';
    return;
  }

  data.tracks.items.forEach(track => {
    const preview = track.preview_url
      ? `<audio controls src="${track.preview_url}"></audio>`
      : `<p style="font-size: 14px; color: #bbb;">🎧 No preview available</p>`;

    const spotifyLink = track.external_urls.spotify;

    resultsDiv.innerHTML += `
      <div class="track-card" 
          onclick="window.open('${spotifyLink}', '_blank')" 
          style="
            cursor: pointer;
            border: 1px solid #333;
            padding: 12px;
            margin-bottom: 12px;
            border-radius: 10px;
            background-color: #1e1e1e;
            color: #fff;
            display: flex;
            align-items: center;
            gap: 12px;
          ">
        <img src="${track.album.images[0].url}" alt="Album Cover" style="width: 80px; height: 80px; border-radius: 6px;" />
        <div>
          <p style="margin: 0;"><strong>${track.name}</strong></p>
          <p style="margin: 4px 0;">${track.artists[0].name}</p>
          ${preview}
        </div>
      </div>
    `;
  });
}
