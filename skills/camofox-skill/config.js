class Config {
  constructor() {
    this.defaults = {
      camofox: {
        baseUrl: process.env.CAMOFOX_URL || 'http://localhost:9377',
        timeout: parseInt(process.env.CAMOFOX_TIMEOUT || '30000'),
        maxRetries: parseInt(process.env.CAMOFOX_RETRIES || '10'),
        pageLoadWaitTime: parseInt(process.env.CAMOFOX_WAIT_TIME || '5'),
      },
      logging: {
        level: process.env.LOG_LEVEL || 'info',
      },
      performance: {
        maxConcurrentTabs: parseInt(process.env.MAX_CONCURRENT_TABS || '1'),
        snapshotMinSize: parseInt(process.env.SNAPSHOT_MIN_SIZE || '500'),
      },
    };
  }

  get(path) {
    const keys = path.split('.');
    let value = this.defaults;
    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key];
      } else {
        return undefined;
      }
    }
    return value;
  }

  getAll() {
    return JSON.parse(JSON.stringify(this.defaults));
  }
}

module.exports = new Config();
