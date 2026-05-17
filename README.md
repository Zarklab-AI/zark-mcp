# Zark MCP

Zark is a remote MCP server for creator-ready image and video work.

Use it from MCP-compatible agents to generate images, edit images, create videos, animate images, edit videos, import files from public URLs, list recent files, and fetch generated file previews.

The remote server is also prepared for ChatGPT Apps: tools include output schemas, Apps SDK `_meta`, a small `text/html;profile=mcp-app` widget resource, and file params for ChatGPT-uploaded images/videos.

## Server

```text
https://api.zarklab.ai/v1/mcp
```

Authentication is via your Zark API key:

```http
X-API-Key: <your-zark-api-key>
```

Get access at [zarklab.ai](https://zarklab.ai).

## CLI

The repo also includes a small CLI for the Zark file/storage workflow.

```bash
git clone https://github.com/Zarklab-AI/zark-mcp.git
cd zark-mcp
npm link
export ZARK_API_KEY="<your-zark-api-key>"
```

List recent files:

```bash
zark files list --limit 10
```

Import a public image, video, or audio URL into Zark storage:

```bash
zark files import-url "https://example.com/product-photo.png" --filename product-photo.png
```

Fetch a generated or imported file preview:

```bash
zark files get file-...
```

Upload a local file:

```bash
zark files upload ./product-photo.png
```

When calling a lower-level development endpoint directly, pass explicit context:

```bash
zark files upload ./product-photo.png --workspace wks_... --user user_...
```

List MCP tools:

```bash
zark mcp tools
```

## Quick Test

Discover the ChatGPT Apps widget resource:

```bash
curl --request POST \
  --url https://api.zarklab.ai/v1/mcp \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: <your-zark-api-key>' \
  --data '{
    "jsonrpc": "2.0",
    "id": 0,
    "method": "resources/list",
    "params": {}
  }'
```

List tools:

```bash
curl --request POST \
  --url https://api.zarklab.ai/v1/mcp \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: <your-zark-api-key>' \
  --data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
  }'
```

Generate an image:

```bash
curl --request POST \
  --url https://api.zarklab.ai/v1/mcp \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: <your-zark-api-key>' \
  --data '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "tools/call",
    "params": {
      "name": "generate_image",
      "arguments": {
        "prompt": "Create a cinematic poster image for a creator coffee brand, warm studio lighting, premium social campaign look.",
        "aspectRatio": "4:5",
        "quality": "High"
      }
    }
  }'
```

Fetch a generated file preview:

```bash
curl --request POST \
  --url https://api.zarklab.ai/v1/mcp \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: <your-zark-api-key>' \
  --data '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "tools/call",
    "params": {
      "name": "get_file",
      "arguments": {
        "fileId": "file-..."
      }
    }
}'
```

Import a public file URL:

```bash
curl --request POST \
  --url https://api.zarklab.ai/v1/mcp \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: <your-zark-api-key>' \
  --data '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/call",
    "params": {
      "name": "import_file_from_url",
      "arguments": {
        "url": "https://example.com/product-photo.png",
        "filename": "product-photo.png"
      }
    }
  }'
```

For ChatGPT Apps file uploads, file tools can receive a file reference directly:

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "tools/call",
  "params": {
    "name": "animate_image",
    "arguments": {
      "prompt": "Animate this logo into a clean cinematic reveal.",
      "inputFile": {
        "download_url": "https://...",
        "file_id": "chatgpt-file-id",
        "mime_type": "image/png",
        "file_name": "logo.png"
      },
      "aspectRatio": "9:16",
      "durationSeconds": 6
    }
  }
}
```

Zark imports that temporary ChatGPT file into your Zark workspace first, then runs the creative tool with a normal Zark `file_id`.

## Tools

| Tool | What it does |
| --- | --- |
| `generate_image` | Create a new image from a prompt. Supports aspect ratio, quality, model choice, and batch count. |
| `edit_image` | Edit, reframe, upscale, resize, remove background, remove objects, or remove text from source images. |
| `generate_video` | Create a new video from a prompt with model, aspect ratio, duration, resolution, and sound controls. |
| `animate_image` | Turn one or more source images into a video. |
| `edit_video` | Edit, reference-edit, extend, upscale, lip-sync, add audio, or motion-transfer a source video. |
| `get_file` | Fetch metadata plus preview/download URLs for generated or referenced Zark files. |
| `get_run_status` | Poll status for a long-running job started with `wait: false`. |
| `get_run_events` | Fetch timeline events for a long-running job. |
| `cancel_run` | Request cancellation for an active creative run. |
| `list_files` | List recent uploaded, generated, or imported files for the API key workspace. |
| `import_file_from_url` | Import a public image, video, or audio URL and return a reusable Zark file ID. |

## Long Jobs

Image generation often finishes inside a normal MCP response. Video can take longer. For long jobs, pass `wait: false` to a media tool and poll the returned `run_id`.

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "tools/call",
  "params": {
    "name": "generate_video",
    "arguments": {
      "runId": "client-run-001",
      "wait": false,
      "prompt": "Create a vertical launch video for a creator coffee brand.",
      "aspectRatio": "9:16",
      "durationSeconds": 6
    }
  }
}
```

Poll status:

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "tools/call",
  "params": {
    "name": "get_run_status",
    "arguments": {
      "runId": "client-run-001"
    }
  }
}
```

Fetch events:

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "tools/call",
  "params": {
    "name": "get_run_events",
    "arguments": {
      "runId": "client-run-001",
      "sinceEventId": 0,
      "limit": 50
    }
  }
}
```

## Registry Links

- Smithery: [smithery.ai/servers/zark/zarklab](https://smithery.ai/servers/zark/zarklab)
- Official MCP Registry: `io.github.Zarklab-AI/zark-media`
- Documentation: [docs.zarklab.ai](https://docs.zarklab.ai)
