const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

// Start the Next.js dev server
const nextDev = spawn("npx", ["next", "dev"], {
  stdio: "inherit",
  shell: true,
});

nextDev.on("close", (code) => {
  process.exit(code);
});

const PORT = 3001;
const DATA_PATH = path.join(__dirname, "..", "src", "data", "portfolio.json");
const MEDIA_DIR = path.join(__dirname, "..", "public", "media");

// Ensure media directory exists
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // ── POST /api/save — write portfolio.json ──────────────────────────────────
  if (req.url === "/api/save" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => { body += chunk.toString(); });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        // Basic schema guard: must contain personalInfo
        if (!data || typeof data !== "object" || !data.personalInfo) {
          throw new Error("Invalid portfolio data schema.");
        }
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, message: "Saved successfully!" }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ── POST /api/media — save a file from base64 data URI ───────────────────
  if (req.url === "/api/media" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => { body += chunk.toString(); });
    req.on("end", () => {
      try {
        const { name, dataUrl } = JSON.parse(body);
        if (!name || !dataUrl) throw new Error("name and dataUrl required.");
        const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches) throw new Error("Invalid data URI.");
        const buffer = Buffer.from(matches[2], "base64");
        const safeName = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath = path.join(MEDIA_DIR, safeName);
        fs.writeFileSync(filePath, buffer);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, url: `/media/${safeName}` }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // ── GET /api/health — quick liveness check ────────────────────────────────
  if (req.url === "/api/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, port: PORT }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(PORT, () => {
  console.log(`\n\x1b[35m[Admin API] http://localhost:${PORT}\x1b[0m`);
  console.log(`\x1b[36m  POST /api/save   — write portfolio.json\x1b[0m`);
  console.log(`\x1b[36m  POST /api/media  — save uploaded file to /public/media/\x1b[0m`);
  console.log(`\x1b[36m  GET  /api/health — liveness check\x1b[0m\n`);
});

process.on("SIGINT", () => {
  nextDev.kill();
  server.close();
  process.exit(0);
});
