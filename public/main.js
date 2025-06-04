// src/main.js

const apiKey = 'YOUR_API_KEY'; // ← 自分のYouTube Data API v3キーを入力
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const videoList = document.getElementById('videoList');

searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchVideos(query);
  }
});

async function fetchVideos(query) {
  videoList.innerHTML = '<p>検索中...</p>';

  try {
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=12&q=${encodeURIComponent(query)}&key=${apiKey}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data.items) {
      videoList.innerHTML = '<p>検索結果が見つかりませんでした。</p>';
      return;
    }

    videoList.innerHTML = '';

    for (const item of data.items) {
      const videoId = item.id.videoId;
      const title = item.snippet.title;
      const thumbnail = item.snippet.thumbnails.medium.url;
      const channelTitle = item.snippet.channelTitle;

      const videoElement = document.createElement('a');
      videoElement.className = 'video-item';
      videoElement.href = `video.html?videoId=${videoId}`;
      videoElement.innerHTML = `
        <img class="thumbnail" src="${thumbnail}" alt="${title}" />
        <div class="video-info">
          <div class="video-title">${title}</div>
          <div class="meta">
            <span>${channelTitle}</span>
          </div>
        </div>
      `;
      videoList.appendChild(videoElement);
    }
  } catch (err) {
    console.error('動画取得エラー:', err);
    videoList.innerHTML = '<p>動画を取得できませんでした。</p>';
  }
}
