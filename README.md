# hibhub2

本项目包含网页音乐动画播放器（Next.js/React）、自动录屏脚本（Node.js + Puppeteer + OBS Studio），可实现网页动画自动播放并自动录制为视频，适合音乐可视化、歌词动画、教学演示等场景。

## 目录结构

```
hibhub2/
├── music-player-main/      # 网页动画播放器（Next.js/React）
├── luping/                # 自动录屏脚本（Node.js + Puppeteer + OBS）
├── __MACOSX/              # 兼容Mac的辅助文件夹（可选）
```

---

## 1. 网页动画播放器

- 位置：`music-player-main/`
- 技术栈：Next.js + React + TypeScript
- 功能：自动播放音乐，歌词/动画同步展示，支持自动播放无需用户点击

### 启动方法

```bash
cd music-player-main
npm install
npm run dev
```

- 默认在 [http://localhost:3000/](http://localhost:3000/) 访问

---

## 2. 自动录屏脚本

- 位置：`luping/auto-record.js`
- 技术栈：Node.js + Puppeteer + OBS Studio
- 功能：自动打开网页，自动启动 OBS 录屏，3 分钟后自动停止录制

### 使用方法

1. **安装依赖**

   ```bash
   cd luping
   npm install
   ```

2. **配置 OBS 路径**

   - 编辑 `auto-record.js`，将 `OBS_DIR` 和 `OBS_EXE` 设置为你本地 OBS 的实际安装路径。

3. **启动网页服务**（见上文）

4. **运行自动录屏脚本**

   ```bash
   node auto-record.js
   ```

   - 浏览器会自动打开网页，OBS 会自动开始录屏，3 分钟后自动停止。

### 注意事项

- OBS 必须已正确安装，且场景中已添加"显示器捕获"或"窗口捕获"源。
- 推荐在 Windows 10/11 下使用，OBS 需为 27.2 及以上版本以支持"应用音频捕获"。
- 录制的视频默认保存到 OBS 设置的录制路径。

---

## 3. 只录制网页声音（不录麦克风）

- 在 OBS 的"音频混音器"中，将"麦克风/辅助音频"静音，只保留"桌面音频"或"应用音频捕获"。
- 详见 [OBS 官方文档](https://obsproject.com/wiki/)。

---

## 4. 贡献与反馈

欢迎提交 issue 或 PR，或在 [GitHub Discussions](https://github.com/tongyichenwangshaoran/hibhub2/discussions) 交流。

---

## 5. License

MIT

---

如需更详细的使用说明、自动化脚本扩展、OBS 场景配置等，请参考各子目录下的 README 或联系作者。 

Record Server 说明
本项目是一个基于 Node.js 的录制服务，结合 Puppeteer 和 OBS，实现自动化录制网页音频与歌词画面并导出为视频文件。适用于需要批量生成带歌词视频的场景。
【功能简介】
接收音频和歌词的 URL，自动打开预览页面
启动 OBS 进行屏幕录制，录制指定时长
自动保存录制视频到本地指定目录
【环境要求】
Node.js 14 及以上
已安装 OBS Studio，并可通过命令行启动
Windows 系统（OBS 路径为 Windows 版）
【安装步骤】
克隆本仓库：
git clone https://github.com/yourusername/record-server.git
cd record-server
安装依赖：
npm install
配置 OBS 路径
编辑 server.js，根据你的实际 OBS 安装路径修改以下变量：
const OBS_DIR = 'D:/hibhub/hibhub2 - 副本 - 副本/obs/obs-studio/bin/64bit';
const OBS_EXE = 'obs64.exe';
【使用方法】
启动服务：
node server.js
默认监听端口为 4000
发送录制请求：
向 POST /api/export-video 发送 JSON 请求体，例如：
{
"audioUrl": "http://example.com/audio.mp3",
"lyricsUrl": "http://example.com/lyrics.lrc",
"duration": 180
}
其中 audioUrl 和 lyricsUrl 必填，duration 为录制时长（秒，默认 180）
录制完成后，可在 videos 目录下找到生成的视频文件。
【注意事项】
录制时会自动打开浏览器和 OBS，请确保两者可正常运行。
录制结束后，OBS 会自动停止录制，但不会自动关闭。
生产环境建议增加录制完成的回调或轮询机制。
【目录结构】
server.js
videos/ // 录制生成的视频文件目录
package.json
...
【许可协议】
MIT License
