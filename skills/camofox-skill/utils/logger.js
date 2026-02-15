class Logger {
  constructor(name = 'Camofox') {
    this.name = name;
    this.levels = { debug: 0, info: 1, warn: 2, error: 3 };
    this.currentLevel = this.levels.info;
  }

  setLevel(level) {
    if (this.levels[level] !== undefined) {
      this.currentLevel = this.levels[level];
    }
  }

  log(level, message, data = null) {
    if (this.levels[level] < this.currentLevel) return;
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.name}] [${level.toUpperCase()}]`;
    console.log(`${prefix} ${message}`);
    if (data) console.log(`  ${JSON.stringify(data, null, 2)}`);
  }

  debug(message, data = null) { this.log('debug', message, data); }
  info(message, data = null) { this.log('info', message, data); }
  warn(message, data = null) { this.log('warn', message, data); }
  error(message, data = null) { this.log('error', message, data); }
}

module.exports = Logger;
