// src/video.js

const apiKey = 'AIzaSyAtA0EA9gDWLuq7WHuPU2Sc_oLzLA3FKA8'; // ← 自分のYouTube Data API キーに差し替えてください
const params = new URLSearchParams(window.location.search);
const videoId = params.get('videoId');

const player = document.getElementById('player');
const videoTitle = document.getElementById('videoTitle');
const channelIcon = document.getElementById('channelIcon');
const channelName = document.getElementById('channelName');
const viewCount = document.getElementById('viewCount');
const relatedContainer = document.getElementById('related');

// YouTube埋め込みプレイヤーを設定
player.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;

getVideoDetails(videoId);
getRelatedVideos(videoId);

async function getVideoDetails(id) {
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!data.items || data.items.length === 0) return;

    const video = data.items[0];
    const snippet = video.snippet;
    const stats = video.statistics;

    videoTitle.textContent = snippet.title;
    channelName.textContent = snippet.channelTitle;
    viewCount.textContent = `視聴回数: ${Number(stats.viewCount).toLocaleString()} 回`;

    // チャンネルアイコン取得
    getChannelIcon(snippet.channelId);
  } catch (err) {
    console.error('動画詳細取得エラー:', err);
  }
}

async function getChannelIcon(channelId) {
  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      channelIcon.src = data.items[0].snippet.thumbnails.default.url;
    }
  } catch (err) {
    console.error('チャンネルアイコン取得エラー:', err);
  }
}

async function getRelatedVideos(id) {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${id}&type=video&maxResults=6&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    relatedContainer.innerHTML = '';

    for (const item of data.items) {
      const vidId = item.id.videoId;
      const title = item.snippet.title;
      const thumbnail = item.snippet.thumbnails.medium.url;
      const channelTitle = item.snippet.channelTitle;

      const el = document.createElement('a');
      el.className = 'video-item';
      el.href = `video.html?videoId=${vidId}`;
      el.innerHTML = `
        <img class="thumbnail" src="${thumbnail}" alt="${title}" />
        <div class="video-info">
          <div class="video-title">${title}</div>
          <div class="meta">${channelTitle}</div>
        </div>
      `;
      relatedContainer.appendChild(el);
    }
  } catch (err) {
    console.error('関連動画取得エラー:', err);
  }
}
