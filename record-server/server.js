const express = require('express');
const puppeteer = require('puppeteer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const OBSWebSocket = require('obs-websocket-js').default;

console.log('当前 server.js 版本：20240608-1');

// OBS 配置
const OBS_DIR = 'D:/动态歌词/hibhub/hibhub2 - 副本 - 副本/obs/obs-studio/bin/64bit';
const OBS_EXE = 'obs64.exe';
const VIDEO_OUTPUT_DIR = path.resolve(__dirname, 'videos');

// 确保输出目录存在
if (!fs.existsSync(VIDEO_OUTPUT_DIR)) {
  fs.mkdirSync(VIDEO_OUTPUT_DIR, { recursive: true });
}

const app = express();
app.use(express.json());

console.log('puppeteer version:', require('puppeteer/package.json').version);

const obs = new OBSWebSocket();

async function recordWithOBS(duration = 180000) {
  await obs.connect('ws://127.0.0.1:4455', '你的密码'); // 默认端口4455，密码在OBS设置-WebSocket Server里
  await obs.call('StartRecord');
  console.log('OBS 开始录制');
  setTimeout(async () => {
    await obs.call('StopRecord');
    console.log('OBS 停止录制');
    await obs.disconnect();
  }, duration);
}

// 接口：接收音频和歌词的URL
app.post('/api/export-video', async (req, res) => {
  const { audioUrl, lyricsUrl, duration = 180 } = req.body;
  if (!audioUrl || !lyricsUrl) {
    return res.status(400).json({ code: 1, message: '缺少音频或歌词地址' });
  }

  // 生成唯一ID和临时页面地址
  const uuid = Date.now() + '_' + Math.floor(Math.random() * 10000);
  const tempPageUrl = `http://localhost:3000/preview?audio=${encodeURIComponent(audioUrl)}&lyrics=${encodeURIComponent(lyricsUrl)}&mode=record`;
  const videoPath = path.join(VIDEO_OUTPUT_DIR, `record_${uuid}.mp4`);

  try {
    // 启动 Puppeteer 打开页面
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--autoplay-policy=no-user-gesture-required']
    });
    const page = await browser.newPage();
    await page.goto(tempPageUrl);
    await page.waitForSelector('audio', { timeout: 5000 });

    // 自动刷新页面
    await page.reload();
    await page.waitForSelector('audio', { timeout: 5000 });

    // 模拟点击页面中央，解除自动播放限制
    await page.mouse.click(640, 360);

    // 在页面内多次尝试 play（自动播放兜底方案）
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => {
        const audio = document.querySelector('audio');
        if (audio && audio.paused) {
          audio.play().catch(() => {});
        }
      });
      await new Promise(r => setTimeout(r, 400));
    }

    // 启动 OBS 录制
    exec(`${OBS_EXE} --startrecording --minimize-to-tray`, { cwd: OBS_DIR }, (error) => {
      if (error) {
        console.error('启动 OBS 失败:', error);
      } else {
        console.log('OBS 启动命令已执行');
      }
    });

    console.log(`开始录制，uuid: ${uuid}`);
    setTimeout(() => {
      console.log(`到达设定时长，准备关闭浏览器和停止录制，uuid: ${uuid}`);
      exec(`${OBS_EXE} --stoprecording`, { cwd: OBS_DIR }, (error) => {
        if (error) {
          console.error('停止 OBS 录制失败:', error);
        } else {
          console.log('OBS 录制已自动停止');
        }
      });
      browser.close();
    }, duration * 1000);

    // 确保页面加载完成后再执行播放逻辑
    await new Promise(r => setTimeout(r, 1000));

    // 返回视频路径（实际生产环境应等录制完成后再返回，或用轮询/回调通知）
    res.json({
      code: 0,
      message: '录制已启动，请稍后到指定目录获取视频',
      videoPath: videoPath
    });
  } catch (err) {
    console.error('录制失败', err);
    res.status(500).json({ code: 2, message: '录制失败', error: err.stack || err.toString() });
  }
});

// 启动服务
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`录制服务已启动，监听端口 ${PORT}`);
}); 