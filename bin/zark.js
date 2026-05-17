#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");

const DEFAULT_BASE_URL = "https://api.zarklab.ai";

let nextRpcId = 1;

function printHelp() {
  console.log(`Zark CLI

Usage:
  zark files list [--limit 20] [--media image|video|audio|all]
  zark files import-url <url> [--filename name]
  zark files get <file_id>
  zark files upload <path>
  zark mcp tools

Environment:
  ZARK_API_KEY       Required. Your Zark API key.
  ZARK_API_BASE_URL Optional. Defaults to ${DEFAULT_BASE_URL}.

Notes:
  Local file upload requires the public storage upload endpoint to be enabled.
  Public URL import, file listing, and file preview use the live Zark MCP tools.
`);
}

function readFlag(args, name, fallback = undefined) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) return fallback;
  return value;
}

function hasFlag(args, name) {
  return args.includes(name);
}

function requireApiKey() {
  const apiKey = process.env.ZARK_API_KEY;
  if (!apiKey) {
    throw new Error("Missing ZARK_API_KEY. Set it before running the CLI.");
  }
  return apiKey;
}

function apiBaseUrl() {
  return (process.env.ZARK_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, "");
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": requireApiKey()
    },
    body: JSON.stringify(body)
  });
  const text = await response.text();
  let parsed;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }
  if (!response.ok) {
    const detail = typeof parsed === "string" ? parsed : JSON.stringify(parsed);
    throw new Error(`HTTP ${response.status}: ${detail}`);
  }
  return parsed;
}

async function callMcp(method, params = {}) {
  const body = {
    jsonrpc: "2.0",
    id: nextRpcId++,
    method,
    params
  };
  const result = await postJson(`${apiBaseUrl()}/v1/mcp`, body);
  if (result && result.error) {
    throw new Error(`MCP ${result.error.code}: ${result.error.message}`);
  }
  return result;
}

async function callTool(name, args) {
  return callMcp("tools/call", {
    name,
    arguments: args
  });
}

function printJson(value) {
  console.log(JSON.stringify(value, null, 2));
}

async function listFiles(args) {
  const limitText = readFlag(args, "--limit", "20");
  const limit = Number.parseInt(limitText, 10);
  if (!Number.isFinite(limit) || limit < 1) {
    throw new Error("--limit must be a positive number.");
  }

  const media = readFlag(args, "--media", "all");
  const toolArgs = { limit };
  if (media && media !== "all") {
    toolArgs.mediaType = media;
  }

  printJson(await callTool("list_files", toolArgs));
}

async function importUrl(args) {
  const url = args[0];
  if (!url || url.startsWith("--")) {
    throw new Error("Usage: zark files import-url <url> [--filename name]");
  }
  const filename = readFlag(args, "--filename");
  const toolArgs = { url };
  if (filename) {
    toolArgs.filename = filename;
  }
  printJson(await callTool("import_file_from_url", toolArgs));
}

async function getFile(args) {
  const fileId = args[0];
  if (!fileId || fileId.startsWith("--")) {
    throw new Error("Usage: zark files get <file_id>");
  }
  printJson(await callTool("get_file", { fileId }));
}

async function uploadFile(args) {
  const filePath = args[0];
  if (!filePath || filePath.startsWith("--")) {
    throw new Error("Usage: zark files upload <path>");
  }

  const resolved = path.resolve(filePath);
  await fs.access(resolved);

  throw new Error(
    "Local file upload is not enabled on the public API yet. " +
      "Use `zark files import-url <public-url>` today, or enable POST /v1/storage/files for multipart uploads."
  );
}

async function listTools() {
  printJson(await callMcp("tools/list", {}));
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || hasFlag(args, "--help") || hasFlag(args, "-h")) {
    printHelp();
    return;
  }

  const [scope, command, ...rest] = args;
  if (scope === "mcp" && command === "tools") {
    await listTools();
    return;
  }

  if (scope === "files") {
    if (command === "list") {
      await listFiles(rest);
      return;
    }
    if (command === "import-url") {
      await importUrl(rest);
      return;
    }
    if (command === "get") {
      await getFile(rest);
      return;
    }
    if (command === "upload") {
      await uploadFile(rest);
      return;
    }
  }

  printHelp();
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});
