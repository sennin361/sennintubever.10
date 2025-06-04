// server.js

const express = require('express');
const path = require('path');
const app = express();

// ポート設定（Renderでは自動的に環境変数 PORT を使う）
const PORT = process.env.PORT || 3000;

// 静的ファイルを配信（public フォルダ）
app.use(express.static(path.join(__dirname, 'public')));

// ルートページ（index.html）
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 動画ページ（video.html）
app.get('/video.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'video.html'));
});

// その他のリクエストは404
app.use((req, res) => {
  res.status(404).send('404 Not Found');
});

// サーバ起動
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
