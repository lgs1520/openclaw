# Camofox OpenClaw Skill

一个 OpenClaw 插件，让你的 agents 能访问被反爬保护的网站。

## 快速开始

### 1. 启动 Mock Camofox 服务
```bash
node mock-camofox.js &
```

### 2. 在 OpenClaw 中注册这个 Skill

编辑 `~/.openclaw/config.yaml`：
```yaml
skills:
  - name: camofox
    path: /home/admin/camofox-skill
    enabled: true
    config:
      maxConcurrentTabs: 1
      logLevel: info
```

### 3. 重启 OpenClaw
```bash
openclaw restart
```

## 可用工具

- `camofox_browse` - 访问 URL
- `camofox_search` - 搜索
- `camofox_click` - 点击元素
- `camofox_scroll` - 滚动页面

## 部署到生产

安装真实的 Camofox：
```bash
npm install @askjo/camofox-browser
npx @askjo/camofox-browser &
```

更多详见 DEPLOYMENT.md
