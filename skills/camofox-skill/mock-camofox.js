const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
  } else if (req.url.startsWith('/tabs') && req.method === 'POST') {
    res.writeHead(200);
    res.end(JSON.stringify({ tabId: 'tab_mock_' + Date.now() }));
  } else if (req.url.includes('/snapshot')) {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      tree: [{ text: 'Example Domain' }, { text: 'Test Content' }],
      elements: [{ ref: 'e1' }, { ref: 'e2' }]
    }));
  } else if (req.url.includes('/click')) {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'clicked' }));
  } else if (req.url.includes('/type')) {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'typed' }));
  } else if (req.url.includes('/scroll')) {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'scrolled' }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(9377, () => {
  console.log('✅ Mock Camofox 服务运行在 http://localhost:9377');
  console.log('按 Ctrl+C 停止');
});
