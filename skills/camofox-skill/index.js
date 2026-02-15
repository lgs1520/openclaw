const CamofoxBrowseHandler = require('./handlers/browse');

const browseHandler = new CamofoxBrowseHandler();

const skillDefinition = {
  name: 'camofox',
  version: '2.0.0',
  description: '使用 Camofox 浏览器访问反爬保护的网站',
  author: 'Bruez',
  
  tools: {
    camofox_browse: {
      description: '访问 URL 并返回页面内容',
      parameters: {
        url: { type: 'string', description: '目标 URL', required: true },
        wait_time: { type: 'number', description: '等待时间（秒）', required: false },
      },
      execute: async (params, context) => {
        const url = params.url;
        const waitTime = params.wait_time || 5;
        const userId = context.userId || 'agent-' + Date.now();
        const sessionKey = context.sessionKey || 'session-' + Date.now();
        return await browseHandler.browse(url, userId, sessionKey, { waitTime });
      },
    },

    camofox_search: {
      description: '在页面上搜索',
      parameters: {
        tab_id: { type: 'string', description: 'Tab ID', required: true },
        search_text: { type: 'string', description: '搜索文本', required: true },
        search_field_ref: { type: 'string', description: '搜索框引用', required: false },
      },
      execute: async (params, context) => {
        const tabId = params.tab_id;
        const searchText = params.search_text;
        const searchFieldRef = params.search_field_ref || 'e1';
        const userId = context.userId || 'agent-' + Date.now();
        return await browseHandler.search(tabId, searchText, userId, { searchFieldRef });
      },
    },

    camofox_click: {
      description: '点击元素',
      parameters: {
        tab_id: { type: 'string', description: 'Tab ID', required: true },
        element_ref: { type: 'string', description: '元素引用', required: true },
      },
      execute: async (params, context) => {
        const tabId = params.tab_id;
        const ref = params.element_ref;
        const userId = context.userId || 'agent-' + Date.now();
        return await browseHandler.clickElement(tabId, ref, userId);
      },
    },

    camofox_scroll: {
      description: '滚动页面',
      parameters: {
        tab_id: { type: 'string', description: 'Tab ID', required: true },
        direction: { type: 'string', enum: ['up', 'down'], description: '方向', required: false },
        amount: { type: 'number', description: '幅度', required: false },
      },
      execute: async (params, context) => {
        const tabId = params.tab_id;
        const direction = params.direction || 'down';
        const amount = params.amount || 3;
        const userId = context.userId || 'agent-' + Date.now();
        return await browseHandler.scrollPage(tabId, direction, amount, userId);
      },
    },
  },

  onLoad: () => {
    console.log('[Skill] Camofox skill 已加载');
  },

  onUnload: () => {
    console.log('[Skill] Camofox skill 已卸载');
    browseHandler.cleanup();
  },
};

module.exports = skillDefinition;
