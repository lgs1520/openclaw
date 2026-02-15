# 维护指南

## 常见修改

### 修改 Camofox 地址

编辑 `~/.openclaw/config.yaml`：
```yaml
config:
  camofoxUrl: http://new-server:9377
```

重启：
```bash
openclaw restart
```

### 增加日志详细度
```bash
export LOG_LEVEL=debug
openclaw restart
```

### 修改页面加载等待时间
```bash
export CAMOFOX_WAIT_TIME=10
openclaw restart
```

### 限制并发数
```bash
export MAX_CONCURRENT_TABS=1
openclaw restart
```

## 监控

### 检查服务状态
```bash
curl http://localhost:9377/health
```

### 查看日志
```bash
openclaw log | tail -20
```

### 检查内存使用
```bash
ps aux | grep camofox | grep -v grep
```

## 备份
```bash
cp -r ~/camofox-skill ~/camofox-skill-backup-$(date +%Y%m%d)
```

## 恢复
```bash
rm -rf ~/camofox-skill
cp -r ~/camofox-skill-backup-20260211 ~/camofox-skill
openclaw restart
```
