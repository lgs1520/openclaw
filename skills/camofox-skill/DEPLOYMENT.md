# 部署指南

## 前置条件

- OpenClaw 已安装
- Node.js 16+

## 部署步骤

### 1. 复制 Skill
```bash
# Skill 已在 ~/camofox-skill
cd ~/camofox-skill
npm install
```

### 2. 编辑 OpenClaw 配置
```bash
vim ~/.openclaw/config.yaml
```

添加：
```yaml
skills:
  - name: camofox
    path: /home/admin/camofox-skill
    enabled: true
    config:
      maxConcurrentTabs: 1
      logLevel: warn
```

### 3. 启动 Camofox 服务

**用 Mock 服务测试（推荐先这样）**：
```bash
cd ~/camofox-skill
node mock-camofox.js &
```

**或安装真实 Camofox**：
```bash
npm install @askjo/camofox-browser
npx @askjo/camofox-browser &
```

### 4. 重启 OpenClaw
```bash
openclaw restart
```

### 5. 验证
```bash
openclaw skill list | grep camofox
curl http://localhost:9377/health
```

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| CAMOFOX_URL | http://localhost:9377 | Camofox 服务地址 |
| LOG_LEVEL | info | 日志级别 |
| MAX_CONCURRENT_TABS | 1 | 最大并发 tab |

设置方式：
```bash
export LOG_LEVEL=debug
openclaw restart
```

## 后台运行

使用 nohup：
```bash
nohup npx @askjo/camofox-browser > /tmp/camofox.log 2>&1 &
```

或用 systemd：
```bash
# 创建 /etc/systemd/system/camofox.service
[Unit]
Description=Camofox Browser Server
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/admin/camofox-skill
ExecStart=/usr/bin/npx @askjo/camofox-browser
Restart=on-failure

[Install]
WantedBy=multi-user.target

# 启动
sudo systemctl start camofox
sudo systemctl enable camofox
```

## 故障排除

### 服务无法连接
```bash
# 检查服务
curl http://localhost:9377/health

# 重启
pkill -f "camofox-browser"
npx @askjo/camofox-browser &
```

### 内存占用过高
```bash
export MAX_CONCURRENT_TABS=1
openclaw restart
```

### 查看日志
```bash
openclaw log | grep camofox
```
