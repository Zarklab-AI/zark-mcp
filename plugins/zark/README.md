# Zark

Learn, Play & Create. Swap the endless scroll for stories, movies and games your family makes with AI.

This plugin connects Claude to Zark (https://www.zarklab.ai), made by Zark Lab, Inc. Describe what you want in
your own words and Zark hands back finished media in the chat: pictures, short videos, music, voice-overs,
sound effects, captions, templates and episode-style short films. Zark can also edit pictures, videos and audio
you already have.

## What it contains

- **One remote MCP server**, `zark`, at `https://mcp.zarklab.ai/` (Streamable HTTP). You sign in with your
  own Zark account through OAuth the first time you use it; Claude opens the Zark sign-in page and you press
  Allow.
- **Three skills** that help Claude use Zark well:
  - `make-with-zark`: hand the request to Zark in the user's own words and show the result.
  - `zark-long-runs`: wait for long videos and films without busy loops, and stop a run.
  - `zark-prices`: show prices and wait for the user's own yes before anything is spent.

The plugin runs no local code, has no hooks and installs no packages.

## What it sends and where

The plugin connects only to Zark's server at `mcp.zarklab.ai`. Your requests, and any files you choose to give
Zark, are sent there. How Zark handles them is in its privacy policy: https://www.zarklab.ai/privacy.

## Cost

Connecting is free. Making something spends credits from your own Zark account. Zark shows the price first
and waits for your yes.

## Support

https://www.zarklab.ai/contact · Terms: https://www.zarklab.ai/terms · Help: https://docs.zarklab.ai/connect-ai-apps
