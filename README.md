# Zark MCP

Zark is a remote MCP server for creator-ready image and video work.

Use it from MCP-compatible agents to generate images, edit images, create videos, animate images, edit videos, and fetch generated file previews.

## Server

```text
https://api.zarklab.ai/v1/mcp
```

Authentication is via your Zark API key:

```http
X-API-Key: <your-zark-api-key>
```

Get access at [zarklab.ai](https://zarklab.ai).

## Quick Test

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

## Tools

| Tool | What it does |
| --- | --- |
| `generate_image` | Create a new image from a prompt. Supports aspect ratio, quality, model choice, and batch count. |
| `edit_image` | Edit, reframe, upscale, resize, remove background, remove objects, or remove text from source images. |
| `generate_video` | Create a new video from a prompt with model, aspect ratio, duration, resolution, and sound controls. |
| `animate_image` | Turn one or more source images into a video. |
| `edit_video` | Edit, reference-edit, extend, upscale, lip-sync, add audio, or motion-transfer a source video. |
| `get_file` | Fetch metadata plus preview/download URLs for generated or referenced Zark files. |

## Registry Links

- Smithery: [smithery.ai/servers/zark/zarklab](https://smithery.ai/servers/zark/zarklab)
- Official MCP Registry: `io.github.Zarklab-AI/zark-media`
- Documentation: [docs.zarklab.ai](https://docs.zarklab.ai)
