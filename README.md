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
