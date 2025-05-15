const express = require('express');
const puppeteer = require('puppeteer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// OBS 配置
const OBS_DIR = 'D:/hibhub/hibhub2 - 副本 - 副本/obs/obs-studio/bin/64bit';
const OBS_EXE = 'obs64.exe';
const VIDEO_OUTPUT_DIR = path.resolve(__dirname, 'videos');

// 确保输出目录存在
if (!fs.existsSync(VIDEO_OUTPUT_DIR)) {
  fs.mkdirSync(VIDEO_OUTPUT_DIR, { recursive: true });
}

const app = express();
app.use(express.json());

// 接口：接收音频和歌词的URL
app.post('/api/export-video', async (req, res) => {
  const { audioUrl, lyricsUrl, duration = 180 } = req.body;
  if (!audioUrl || !lyricsUrl) {
    return res.status(400).json({ code: 1, message: '缺少音频或歌词地址' });
  }

  // 生成唯一ID和临时页面地址
  const uuid = Date.now() + '_' + Math.floor(Math.random() * 10000);
  const tempPageUrl = `http://localhost:3000/preview?audio=${encodeURIComponent(audioUrl)}&lyrics=${encodeURIComponent(lyricsUrl)}`;
  const videoPath = path.join(VIDEO_OUTPUT_DIR, `record_${uuid}.mp4`);

  try {
    // 启动 Puppeteer 打开页面
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();
    await page.goto(tempPageUrl);

    // 启动 OBS 录制
    exec(`${OBS_EXE} --startrecording --minimize-to-tray`, { cwd: OBS_DIR }, (error) => {
      if (error) {
        console.error('启动 OBS 失败:', error);
      } else {
        console.log('OBS 启动命令已执行');
      }
    });

    // 录制 duration 秒
    setTimeout(() => {
      exec(`${OBS_EXE} --stoprecording`, { cwd: OBS_DIR }, (error) => {
        if (error) {
          console.error('停止 OBS 录制失败:', error);
        } else {
          console.log('OBS 录制已自动停止');
        }
      });
      browser.close();
    }, duration * 1000);

    // 返回视频路径（实际生产环境应等录制完成后再返回，或用轮询/回调通知）
    res.json({
      code: 0,
      message: '录制已启动，请稍后到指定目录获取视频',
      videoPath: videoPath
    });
  } catch (err) {
    res.status(500).json({ code: 2, message: '录制失败', error: err.toString() });
  }
});

// 启动服务
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`录制服务已启动，监听端口 ${PORT}`);
}); 