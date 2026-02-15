# 快速开始

## 5 分钟快速体验

### 1. 启动 Mock 服务
```bash
cd ~/camofox-skill
node mock-camofox.js
```

看到 `✅ Mock Camofox 服务运行在 http://localhost:9377` 就成功了。

### 2. 配置 OpenClaw

编辑 `~/.openclaw/config.yaml`，添加：
```yaml
skills:
  - name: camofox
    path: /home/admin/camofox-skill
    enabled: true
```

### 3. 重启 OpenClaw
```bash
openclaw restart
```

现在 BigclawHaaa 可以使用 camofox 工具了！

### 4. 测试

在你的 agent 中：
```javascript
const result = await skill.camofox_browse({
  url: 'https://x.com',
  wait_time: 5
});

console.log(result.tabId);  // tab_xxx
```

## 升级到真实 Camofox
```bash
cd ~/camofox-skill
npm install @askjo/camofox-browser
npx @askjo/camofox-browser &
```

重启 OpenClaw：
```bash
openclaw restart
```

Done! 现在可以访问真实的反爬网站了。
