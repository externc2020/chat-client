const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware(
    '/ws',
    {
      target: 'http://127.0.0.1:8080/',
      changeOrigin: true,
      ws: true,
      secure: false,
      logLevel: 'error',
    })
  );
};
