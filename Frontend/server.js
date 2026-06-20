import express from "express";
import compression from "compression";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, "dist");

const app = express();

app.use(compression());

const INDEX_HTML = path.join(DIST, "index.html");
const INDEX_CONTENT = fs.readFileSync(INDEX_HTML, "utf-8");

app.use(
  express.static(DIST, {
    maxAge: "1y",
    immutable: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  })
);

app.get("*", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(INDEX_CONTENT);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
