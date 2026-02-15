const { execSync } = require('child_process');

const skillDefinition = {
  name: 'github_trending',
  version: '1.0.0',
  description: '扫描 GitHub Trending 和 Hacker News，发现热门 AI 项目',
  author: 'Bruez',
  
  tools: {
    scan_github_trending: {
      description: '扫描 GitHub Trending 页面，获取热门项目列表',
      parameters: {},
      execute: async (params, context) => {
        try {
          const result = execSync('python3 /home/admin/github_scanner.py', {
            encoding: 'utf8',
            maxBuffer: 10 * 1024 * 1024,
            timeout: 30000
          });
          return {
            success: true,
            data: result
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    }
  },

  onLoad: () => {
    console.log('[Skill] GitHub Trending Scanner 已加载');
  },

  onUnload: () => {
    console.log('[Skill] GitHub Trending Scanner 已卸载');
  }
};

module.exports = skillDefinition;
