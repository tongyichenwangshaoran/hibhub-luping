import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  // 绝对路径，确保指向你的 record-music-player.js
  const scriptPath = path.resolve('/D:/hibhub2 - 副本 - 副本/WebVideoCreator-master/record-music-player.js');

  exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('导出失败:', error, stderr);
      return res.status(500).json({ message: '导出失败', error: stderr });
    }
    res.status(200).json({ message: '导出完成', output: stdout });
  });
} 