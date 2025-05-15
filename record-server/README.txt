Record Server 说明

本项目是一个基于 Node.js 的录制服务，结合 Puppeteer 和 OBS，实现自动化录制网页音频与歌词画面并导出为视频文件。适用于需要批量生成带歌词视频的场景。

【功能简介】
- 接收音频和歌词的 URL，自动打开预览页面
- 启动 OBS 进行屏幕录制，录制指定时长
- 自动保存录制视频到本地指定目录

【环境要求】
- Node.js 14 及以上
- 已安装 OBS Studio，并可通过命令行启动
- Windows 系统（OBS 路径为 Windows 版）

【安装步骤】
1. 克隆本仓库：
   git clone https://github.com/yourusername/record-server.git
   cd record-server

2. 安装依赖：
   npm install

3. 配置 OBS 路径
   编辑 server.js，根据你的实际 OBS 安装路径修改以下变量：
   const OBS_DIR = 'D:/hibhub/hibhub2 - 副本 - 副本/obs/obs-studio/bin/64bit';
   const OBS_EXE = 'obs64.exe';

【使用方法】
1. 启动服务：
   node server.js
   默认监听端口为 4000

2. 发送录制请求：
   向 POST /api/export-video 发送 JSON 请求体，例如：
   {
     "audioUrl": "http://example.com/audio.mp3",
     "lyricsUrl": "http://example.com/lyrics.lrc",
     "duration": 180
   }
   其中 audioUrl 和 lyricsUrl 必填，duration 为录制时长（秒，默认 180）

3. 录制完成后，可在 videos 目录下找到生成的视频文件。

【注意事项】
- 录制时会自动打开浏览器和 OBS，请确保两者可正常运行。
- 录制结束后，OBS 会自动停止录制，但不会自动关闭。
- 生产环境建议增加录制完成的回调或轮询机制。

【目录结构】
server.js
videos/           // 录制生成的视频文件目录
package.json
...

【许可协议】
MIT License

如需进一步定制或有问题，欢迎联系作者或提 Issue。 