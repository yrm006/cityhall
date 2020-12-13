const express = require('express');
const app = express();
// パス指定用モジュール
const path = require('path');
const http = require('http');

// 8080番ポートで待ちうける

app.use(express.static(path.join(__dirname, 'public')));

app.listen(8000, () => {
  console.log('Running at Port 8080...');
});
