const CamofoxClient = require('../camofox-client');

class CamofoxBrowseHandler {
  constructor(baseUrl = 'http://localhost:9377') {
    this.client = new CamofoxClient(baseUrl);
    this.activeTabs = new Map();
  }

  async browse(url, userId, sessionKey, options = {}) {
    const { waitTime = 5, retries = 10 } = options;
    console.log(`[browse] 访问: ${url}`);

    try {
      const tabResponse = await this.client.createTab(userId, sessionKey, url);
      const tabId = tabResponse.tabId;
      this.activeTabs.set(tabId, { url, userId, createdAt: Date.now() });

      const delayMs = (waitTime * 1000) / retries;
      const snapshot = await this.client.waitForPageLoad(tabId, userId, retries, delayMs);

      const contentSize = JSON.stringify(snapshot).length;
      const quality = this.evaluateQuality(snapshot);

      return {
        tabId,
        url,
        timestamp: new Date().toISOString(),
        contentSize,
        quality,
        snapshot,
      };
    } catch (error) {
      console.error(`[browse] 错误: ${error.message}`);
      throw error;
    }
  }

  async search(tabId, searchText, userId, options = {}) {
    const { searchFieldRef = 'e1' } = options;
    console.log(`[search] 搜索: "${searchText}"`);

    try {
      await this.client.click(tabId, searchFieldRef, userId);
      await this.client.type(tabId, searchFieldRef, searchText, userId);
      await this.client.type(tabId, searchFieldRef, '\n', userId);

      await new Promise(resolve => setTimeout(resolve, 2000));

      const resultSnapshot = await this.client.getSnapshot(tabId, userId);

      return {
        tabId,
        searchText,
        timestamp: new Date().toISOString(),
        snapshot: resultSnapshot,
      };
    } catch (error) {
      console.error(`[search] 错误: ${error.message}`);
      throw error;
    }
  }

  async clickElement(tabId, ref, userId) {
    console.log(`[click] 点击: ${ref}`);

    try {
      await this.client.click(tabId, ref, userId);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const snapshot = await this.client.getSnapshot(tabId, userId);

      return {
        tabId,
        clickedRef: ref,
        timestamp: new Date().toISOString(),
        snapshot,
      };
    } catch (error) {
      console.error(`[click] 错误: ${error.message}`);
      throw error;
    }
  }

  async scrollPage(tabId, direction = 'down', amount = 3, userId) {
    console.log(`[scroll] 滚动: ${direction} x${amount}`);

    try {
      await this.client.scroll(tabId, direction, amount, userId);
      await new Promise(resolve => setTimeout(resolve, 1000));

      const snapshot = await this.client.getSnapshot(tabId, userId);

      return {
        tabId,
        direction,
        amount,
        timestamp: new Date().toISOString(),
        snapshot,
      };
    } catch (error) {
      console.error(`[scroll] 错误: ${error.message}`);
      throw error;
    }
  }

  evaluateQuality(snapshot) {
    const snapshotSize = JSON.stringify(snapshot).length;

    let score = 5;
    let reason = '数据正常';

    if (snapshotSize < 500) {
      score = 2;
      reason = '数据过少';
    } else if (snapshotSize < 1000) {
      score = 5;
      reason = '数据部分可用';
    } else if (snapshotSize < 5000) {
      score = 7;
      reason = '数据良好';
    } else {
      score = 9;
      reason = '数据完整';
    }

    return {
      score,
      reason,
      snapshotSize,
      elementCount: (snapshot.elements || []).length,
    };
  }

  cleanup() {
    console.log(`清理 ${this.activeTabs.size} 个 tab`);
    this.activeTabs.clear();
  }
}

module.exports = CamofoxBrowseHandler;
