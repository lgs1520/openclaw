const http = require('http');
const { URL } = require('url');

class CamofoxClient {
  constructor(baseUrl = 'http://localhost:9377') {
    this.baseUrl = baseUrl;
    this.timeout = 30000;
  }

  async request(method, path, body = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const options = {
        hostname: url.hostname,
        port: url.port || 9377,
        path: url.pathname + url.search,
        method: method,
        headers: { 'Content-Type': 'application/json' },
        timeout: this.timeout,
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (res.statusCode >= 400) {
              reject(new Error(`HTTP ${res.statusCode}`));
            } else {
              resolve(json);
            }
          } catch (e) {
            reject(new Error(`Failed to parse response`));
          }
        });
      });

      req.on('error', (err) => reject(new Error(`Request failed: ${err.message}`)));
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });

      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  }

  async health() {
    return this.request('GET', '/health');
  }

  async createTab(userId, sessionKey, url) {
    return this.request('POST', '/tabs', { userId, sessionKey, url });
  }

  async getSnapshot(tabId, userId) {
    const path = `/tabs/${tabId}/snapshot?userId=${encodeURIComponent(userId)}`;
    return this.request('GET', path);
  }

  async click(tabId, ref, userId) {
    return this.request('POST', `/tabs/${tabId}/click`, { userId, ref });
  }

  async type(tabId, ref, text, userId) {
    return this.request('POST', `/tabs/${tabId}/type`, { userId, ref, text });
  }

  async scroll(tabId, direction, amount, userId) {
    return this.request('POST', `/tabs/${tabId}/scroll`, { userId, direction, amount });
  }

  async waitForPageLoad(tabId, userId, maxRetries = 10, delayMs = 500) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const snapshot = await this.getSnapshot(tabId, userId);
        if (snapshot && snapshot.tree) return snapshot;
      } catch (e) {}
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    throw new Error(`Page did not load`);
  }
}

module.exports = CamofoxClient;
