// Minimal server - no Next, no React. Run: node simple-server.js
// Then open http://127.0.0.1:3999 in your browser.
const http = require("http");
const port = 3999;
const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Test</title></head>
<body style="margin:20px;font-family:system-ui;background:#f0f4f8;color:#1a1a1a;">
  <h1>Proposal Writer – test</h1>
  <p>If you see this, a local server works in your browser.</p>
  <p>Next: try the real app at <a href="http://127.0.0.1:3000">http://127.0.0.1:3000</a></p>
</body>
</html>
`;
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(html);
});
server.listen(port, "127.0.0.1", () => {
  console.log("Simple server: open http://127.0.0.1:" + port + " in your browser.");
});
